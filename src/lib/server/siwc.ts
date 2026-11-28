import type { APIContext } from 'astro'

import { CHAT_PROVIDER, FREE_CHAT_SIWC_DIR } from 'astro:env/server'
import { Buffer } from 'node:buffer'
import { createHash, createPublicKey, randomBytes, randomUUID, verify } from 'node:crypto'
import { constants } from 'node:fs'
import { lstat, mkdir, open, rename, rm } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

const issuer = 'https://auth.openai.com'
const resource = 'https://api.openai.com/v1'
const callbackPath = '/auth/callback'
const callbackCookie = 'free-chat-siwc-attempt'
const attemptSeconds = 600
const dynamicClient = 'dynamic_agent_client'
const planScope = 'chatgpt.tokens.use.direct'
const reauthErrors = new Set(['invalid_grant', 'invalid_refresh_token', 'token_expired', 'refresh_token_expired', 'refresh_token_invalidated', 'refresh_token_reused'])

interface Tokens {
  access: string
  refresh: string
  expiresAt: number
  refreshAfter?: number
  scope: string
}

interface Account {
  id: string
  clientId: string
  subject: string
  label: string
  tokens?: Tokens
  needsConsent?: true
}

interface Profile {
  hostId: string
  accounts: Account[]
  activeAccountId?: string
}

interface Attempt {
  accountId?: string
  clientId: string
  state: string
  binding: string
  verifier: string
  nonce: string
  redirectUri: string
  expiresAt: number
}

let attempt: Attempt | undefined
let profileQueue = Promise.resolve()

export const siwcHeaders = { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' }

export class SiwcAccountError extends Error {}

export function isLocalChatRequest(context: APIContext): boolean {
  if (process.env.OUTPUT === 'netlify' || process.env.OUTPUT === 'vercel' || process.env.NETLIFY || process.env.VERCEL) return false
  const { headers } = context.request
  const url = new URL(context.request.url)
  if (url.protocol !== 'http:' || url.hostname !== '127.0.0.1' || context.url.origin !== url.origin || headers.get('host') !== url.host) return false
  // Astro can derive clientAddress from forwarding headers, so reject them before trusting it.
  for (const name of headers.keys()) {
    if (name === 'forwarded' || name === 'via' || name === 'x-real-ip' || name === 'cf-connecting-ip' || name.startsWith('x-forwarded-')) return false
  }
  try {
    return context.clientAddress === '127.0.0.1' || context.clientAddress === '::ffff:127.0.0.1'
  } catch {
    return false
  }
}

export function isLocalSiwcRequest(context: APIContext): boolean {
  return CHAT_PROVIDER === 'siwc' && isLocalChatRequest(context)
}

export function isSameOriginChatRequest(context: APIContext): boolean {
  return context.request.headers.get('origin') === context.url.origin
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function hasScope(scope: string): boolean {
  return scope.split(/\s+/).includes(planScope)
}

async function profilePath() {
  const directory = resolve(FREE_CHAT_SIWC_DIR || join(process.env.XDG_CONFIG_HOME || join(homedir(), '.config'), 'free-chat'))
  await mkdir(directory, { recursive: true, mode: 0o700 })
  const info = await lstat(directory)
  if (!info.isDirectory() || (process.getuid && (info.uid !== process.getuid() || (info.mode & 0o077) !== 0))) throw new Error('SIWC needs a private data directory.')
  return join(directory, 'siwc.json')
}

async function readProfile(path: string): Promise<Profile | undefined> {
  const file = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW || 0)).catch((error: { code?: string }) => {
    if (error.code !== 'ENOENT') throw error
  })
  if (!file) return
  try {
    const info = await file.stat()
    if (!info.isFile() || (process.getuid && (info.uid !== process.getuid() || (info.mode & 0o077) !== 0))) throw new Error('SIWC needs a private credential file.')
    return JSON.parse(await file.readFile('utf8')) as Profile
  } finally {
    await file.close()
  }
}

async function writeProfile(path: string, profile: Profile) {
  const temporary = `${path}.${randomUUID()}.tmp`
  const file = await open(temporary, 'wx', 0o600)
  try {
    try {
      await file.writeFile(JSON.stringify(profile))
      await file.sync()
    } finally {
      await file.close()
    }
    await rename(temporary, path)
  } finally {
    await rm(temporary, { force: true })
  }
}

async function withProfile<T>(operation: (profile: Profile, save: () => Promise<void>) => Promise<T>): Promise<T> {
  // Only one free-chat process may own a profile directory; a rotating token is single-use.
  const result = profileQueue.then(async() => {
    const path = await profilePath()
    const profile: Profile = await readProfile(path) ?? { hostId: `urn:uuid:${randomUUID()}`, accounts: [] }
    return operation(profile, () => writeProfile(path, profile))
  })
  profileQueue = result.then(() => {}, () => {})
  return result
}

function accountFor(profile: Profile, accountId: string): Account {
  const account = profile.accounts.find(account => account.id === accountId)
  if (!account) throw new SiwcAccountError('Unknown ChatGPT account.')
  return account
}

export async function getSiwcAccounts() {
  const profile = await readProfile(await profilePath())
  return {
    accounts: (profile?.accounts ?? []).map(account => ({ id: account.id, label: account.label, connected: account.tokens !== undefined })),
    activeAccountId: profile?.activeAccountId,
  }
}

export async function startSiwcLogin(context: APIContext, accountId?: string) {
  return withProfile(async(profile, save) => {
    const account = accountId ? accountFor(profile, accountId) : undefined
    const clientId = account?.clientId ?? dynamicClient
    await save()
    const pending: Attempt = {
      accountId,
      clientId,
      state: randomBytes(32).toString('base64url'),
      binding: randomBytes(32).toString('base64url'),
      verifier: randomBytes(64).toString('base64url'),
      nonce: randomBytes(32).toString('base64url'),
      redirectUri: new URL(callbackPath, context.url).href,
      expiresAt: Date.now() + attemptSeconds * 1000,
    }
    const url = new URL(`${issuer}/api/accounts/authorize`)
    url.search = new URLSearchParams({
      client_id: clientId,
      ext_agent_host_id: profile.hostId,
      response_type: 'code',
      redirect_uri: pending.redirectUri,
      scope: `openid profile email offline_access resource.invoke ${planScope}`,
      resource,
      state: pending.state,
      nonce: pending.nonce,
      code_challenge_method: 'S256',
      code_challenge: createHash('sha256').update(pending.verifier).digest('base64url'),
    }).toString()
    if (clientId === dynamicClient) url.searchParams.set('agent_name_hint', 'free-chat')
    if (account?.needsConsent) url.searchParams.set('prompt', 'consent')
    attempt = pending
    // OAuth requires HTTP loopback; bind state to a separate host-only, HttpOnly cookie.
    context.cookies.set(callbackCookie, pending.binding, { path: callbackPath, httpOnly: true, sameSite: 'lax', maxAge: attemptSeconds })
    return url.href
  })
}

async function openaiFetch(url: string, form?: Record<string, string>) {
  return fetch(url, {
    method: form ? 'POST' : 'GET',
    headers: { Accept: 'application/json' },
    body: form ? new URLSearchParams(form) : undefined,
    redirect: 'error',
    signal: AbortSignal.timeout(7500),
  })
}

async function tokenRequest(form: Record<string, string>) {
  const response = await openaiFetch(`${issuer}/api/accounts/oauth/token`, { ...form, resource })
  return { ok: response.ok, data: record(await response.json()) }
}

function readTokens(data: Record<string, unknown>, scope: string): Tokens {
  if (typeof data.access_token !== 'string' || !data.access_token || typeof data.refresh_token !== 'string' || !data.refresh_token
    || typeof data.expires_in !== 'number' || !Number.isFinite(data.expires_in) || data.expires_in <= 0
    || typeof data.token_type !== 'string' || data.token_type.toLowerCase() !== 'bearer') throw new Error('Invalid SIWC token response.')
  const earliest = data.earliest_refresh_at
  const refreshAfter = typeof earliest === 'number' ? (earliest < 1e12 ? earliest * 1000 : earliest) : typeof earliest === 'string' ? Date.parse(earliest) : Number.NaN
  return { access: data.access_token, refresh: data.refresh_token, expiresAt: Date.now() + data.expires_in * 1000, refreshAfter: Number.isFinite(refreshAfter) ? refreshAfter : undefined, scope }
}

async function verifyIdentity(idToken: unknown, clientId: string, nonce: string) {
  const invalid = () => new Error('Invalid SIWC identity.')
  if (typeof idToken !== 'string') throw invalid()
  const parts = idToken.split('.')
  if (parts.length !== 3 || parts.some(part => !/^[\w-]+$/.test(part))) throw invalid()
  const [header, claims, signature] = parts
  const metadata = record(JSON.parse(Buffer.from(header, 'base64url').toString('utf8')))
  if (metadata.alg !== 'RS256' || typeof metadata.kid !== 'string' || 'crit' in metadata) throw invalid()
  const response = await openaiFetch(`${issuer}/.well-known/jwks.json`)
  if (!response.ok) throw invalid()
  const { keys } = record(await response.json())
  if (!Array.isArray(keys)) throw invalid()
  const key = keys.map(record).find(key => key.kid === metadata.kid && key.kty === 'RSA' && (key.use === undefined || key.use === 'sig') && (key.alg === undefined || key.alg === 'RS256'))
  if (!key || typeof key.n !== 'string' || typeof key.e !== 'string') throw invalid()
  const publicKey = createPublicKey({ key: { kty: 'RSA', n: key.n, e: key.e }, format: 'jwk' })
  if (!verify('RSA-SHA256', Buffer.from(`${header}.${claims}`), publicKey, Buffer.from(signature, 'base64url'))) throw invalid()
  const { iss, aud, azp, exp, nbf, nonce: tokenNonce, sub, email } = record(JSON.parse(Buffer.from(claims, 'base64url').toString('utf8')))
  const time = Math.floor(Date.now() / 1000)
  const audienceMatches = aud === clientId || (Array.isArray(aud) && aud.length === 1 && aud[0] === clientId)
  if (iss !== issuer || !audienceMatches || (azp !== undefined && azp !== clientId) || typeof exp !== 'number' || !Number.isFinite(exp) || exp <= time
    || (nbf !== undefined && (typeof nbf !== 'number' || !Number.isFinite(nbf) || nbf > time)) || tokenNonce !== nonce || typeof sub !== 'string' || !sub) throw invalid()
  return { subject: sub, email: typeof email === 'string' && email.length <= 320 ? email : undefined }
}

export async function completeSiwcLogin(context: APIContext): Promise<'connected' | 'denied' | 'error'> {
  const { searchParams, origin, pathname } = context.url
  const pending = attempt
  if (!pending || pending.expiresAt <= Date.now() || pending.redirectUri !== `${origin}${pathname}`
    || pending.binding !== context.cookies.get(callbackCookie)?.value || pending.state !== searchParams.get('state')) return 'error'
  attempt = undefined
  context.cookies.delete(callbackCookie, { path: callbackPath, httpOnly: true, sameSite: 'lax' })
  const error = searchParams.get('error')
  if (error) return error === 'access_denied' ? 'denied' : 'error'
  const code = searchParams.get('code')
  const returnedClient = searchParams.get('client_id')
  const clientId = pending.clientId === dynamicClient ? returnedClient : pending.clientId
  if (!code || !clientId || !/^[\w-]{1,200}$/.test(clientId) || clientId === dynamicClient || (returnedClient !== null && returnedClient !== clientId)) return 'error'

  return withProfile(async(profile, save) => {
    const response = await tokenRequest({ grant_type: 'authorization_code', client_id: clientId, redirect_uri: pending.redirectUri, code, code_verifier: pending.verifier })
    if (!response.ok) return 'error'
    const identity = await verifyIdentity(response.data.id_token, clientId, pending.nonce)
    const existing = pending.accountId ? accountFor(profile, pending.accountId) : profile.accounts.find(account => account.clientId === clientId)
    if (existing && (existing.clientId !== clientId || existing.subject !== identity.subject)) return 'error'
    const scope = typeof response.data.scope === 'string' ? response.data.scope : ''
    const tokens = hasScope(scope) ? readTokens(response.data, scope) : undefined
    const baseLabel = identity.email || 'ChatGPT account'
    const dupe = profile.accounts.some(account => account.label === baseLabel)
    const id = existing?.id ?? randomUUID()
    const account: Account = existing ?? { id, subject: identity.subject, clientId, label: dupe ? `${baseLabel} · ${id.slice(0, 8)}` : baseLabel }
    if (!existing) profile.accounts.push(account)
    account.tokens = tokens
    if (tokens) {
      delete account.needsConsent
      profile.activeAccountId = account.id
    } else {
      account.needsConsent = true
    }
    await save()
    return tokens ? 'connected' : 'denied'
  })
}

export async function selectSiwcAccount(accountId: string) {
  return withProfile(async(profile, save) => {
    if (!accountFor(profile, accountId).tokens) throw new SiwcAccountError('Sign in to this ChatGPT account first.')
    profile.activeAccountId = accountId
    attempt = undefined
    await save()
  })
}

async function revoke(clientId: string, refreshToken: string) {
  for (let tries = 0; tries < 2; tries++) {
    if (tries) await new Promise(resolveWait => setTimeout(resolveWait, 500))
    try {
      const discovery = await openaiFetch(`${issuer}/.well-known/openid-configuration`)
      if (!discovery.ok) {
        if (discovery.status < 500) return false
        continue
      }
      const config = record(await discovery.json())
      if (config.issuer !== issuer || typeof config.revocation_endpoint !== 'string') return false
      const endpoint = new URL(config.revocation_endpoint)
      if (endpoint.origin !== issuer || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) return false
      const response = await openaiFetch(endpoint.href, { client_id: clientId, token: refreshToken, token_type_hint: 'refresh_token' })
      if (response.ok) return true
      if (response.status < 500) return false
    } catch {
      // The local session is cleared even when OpenAI cannot confirm revocation.
    }
  }
  return false
}

export async function signOutSiwc(accountId?: string) {
  return withProfile(async(profile, save) => {
    attempt = undefined
    const selected = accountId ?? profile.activeAccountId
    if (!selected) return {}
    const account = accountFor(profile, selected)
    const revoked = account.tokens ? await revoke(account.clientId, account.tokens.refresh) : undefined
    delete account.tokens
    if (profile.activeAccountId === selected) delete profile.activeAccountId
    await save()
    return { revoked }
  })
}

export async function getSiwcAccessToken(): Promise<string | undefined> {
  return withProfile(async(profile, save) => {
    const account = profile.accounts.find(account => account.id === profile.activeAccountId)
    const tokens = account?.tokens
    if (!account || !tokens) return
    const now = Date.now()
    if (tokens.expiresAt > now + 60_000) return tokens.access
    if (tokens.refreshAfter && tokens.refreshAfter > now) {
      if (tokens.expiresAt > now) return tokens.access
      throw new Error('The ChatGPT session cannot refresh yet.')
    }
    const response = await tokenRequest({ grant_type: 'refresh_token', client_id: account.clientId, refresh_token: tokens.refresh })
    if (!response.ok) {
      if (typeof response.data.error === 'string' && reauthErrors.has(response.data.error)) {
        delete account.tokens
        await save()
        return
      }
      throw new Error('Could not refresh the ChatGPT session.')
    }
    const scope = typeof response.data.scope === 'string' ? response.data.scope : tokens.scope
    if (!hasScope(scope)) {
      delete account.tokens
      account.needsConsent = true
      await save()
      return
    }
    account.tokens = readTokens(response.data, scope)
    await save()
    return account.tokens.access
  })
}
