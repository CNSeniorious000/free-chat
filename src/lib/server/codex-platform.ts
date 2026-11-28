import type { APIContext } from 'astro'

import { FREE_CHAT_CODEX_APP_KEY, FREE_CHAT_CODEX_PLATFORM_URL } from 'astro:env/server'
import { randomBytes } from 'node:crypto'

import { isLocalSiwcRequest } from './siwc'

const platformUrl = URL.parse(FREE_CHAT_CODEX_PLATFORM_URL?.trim() ?? '')
const appKey = FREE_CHAT_CODEX_APP_KEY?.trim()
const platformHttps = platformUrl?.protocol === 'https:'
const platformLoopback = platformUrl?.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(platformUrl.hostname)
const platformOrigin = platformUrl && (platformHttps || platformLoopback) && platformUrl.href === `${platformUrl.origin}/` && appKey && /^[\w-]{43,128}$/.test(appKey) ? platformUrl.origin : undefined
const connectionCookie = '__Host-free-chat-codex'
const cookieOptions = { path: '/', secure: true, httpOnly: true, sameSite: 'strict' } as const
const verificationUri = 'https://auth.openai.com/codex/device'
const platformTimeoutMs = 7500

type CodexPath = '' | '/device' | '/device/token' | '/v1/models' | '/v1/responses'

export function isHostedCodexRequest(context: Pick<APIContext, 'request' | 'url' | 'clientAddress'>) {
  return Boolean(platformOrigin && (platformHttps ? context.url.protocol === 'https:' : isLocalSiwcRequest(context)))
}

export function getHostedCodexConnection(context: APIContext) {
  const connection = context.cookies.get(connectionCookie)?.value
  return connection && /^[\w-]{43}$/.test(connection) ? connection : undefined
}

export async function fetchHostedCodex(connection: string, path: CodexPath, method: 'GET' | 'POST' | 'DELETE', signal: AbortSignal, payload?: object) {
  if (!platformOrigin || !appKey) throw new Error('Hosted Codex is not configured.')
  const headers = new Headers({ 'Authorization': `Bearer ${appKey}`, 'X-Codex-Connection': connection, 'Accept': payload ? 'text/event-stream' : 'application/json' })
  if (payload) headers.set('Content-Type', 'application/json')
  const requestSignal = path === '/v1/responses' ? signal : AbortSignal.any([signal, AbortSignal.timeout(platformTimeoutMs)])
  return fetch(`${platformOrigin}/connect/codex${path}`, { method, headers, signal: requestSignal, body: payload ? JSON.stringify(payload) : undefined, redirect: 'error', cache: 'no-store' })
}

async function responseJson(response: Response): Promise<Record<string, unknown>> {
  if (!response.ok) throw new Error('Platform refused the Codex request.')
  return response.json()
}

export async function hostedCodexConnected(context: APIContext) {
  const connection = getHostedCodexConnection(context)
  if (!connection) return false
  const result = await responseJson(await fetchHostedCodex(connection, '', 'GET', context.request.signal))
  if (typeof result.connected !== 'boolean') throw new TypeError('Invalid Platform connection status.')
  return result.connected
}

export async function startHostedCodexDevice(context: APIContext) {
  const previous = getHostedCodexConnection(context)
  const connection = previous ?? randomBytes(32).toString('base64url')
  const result = await responseJson(await fetchHostedCodex(connection, '/device', 'POST', context.request.signal))
  const { userCode, interval, expiresAt } = result
  if (result.verificationUri !== verificationUri || typeof userCode !== 'string' || !/^[a-z\d-]{4,32}$/i.test(userCode)
    || typeof interval !== 'number' || !Number.isSafeInteger(interval) || interval < 1 || interval > 900
    || typeof expiresAt !== 'number' || !Number.isSafeInteger(expiresAt)) throw new Error('Invalid Platform device authorization.')
  const expiresInMs = expiresAt * 1000 - Date.now()
  if (expiresInMs <= 0) throw new Error('Expired Platform device authorization.')

  if (!previous) context.cookies.set(connectionCookie, connection, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 })
  return { verificationUri, userCode, interval, expiresInMs }
}

function retryAfterSeconds(value: string | null) {
  if (!value) return
  const seconds = /^\d+$/.test(value) ? Number(value) : Math.max(0, Math.ceil((Date.parse(value) - Date.now()) / 1000))
  if (Number.isSafeInteger(seconds)) return seconds
}

export async function pollHostedCodex(context: APIContext): Promise<{ status: 'pending' | 'connected' | 'expired' | 'denied'; retryAfter?: number }> {
  const connection = getHostedCodexConnection(context)
  if (!connection) return { status: 'expired' }
  const response = await fetchHostedCodex(connection, '/device/token', 'POST', context.request.signal)
  const retryAfter = retryAfterSeconds(response.headers.get('retry-after'))
  if (response.status === 429) return { status: 'pending', retryAfter }
  const { status } = await responseJson(response)
  if (status !== 'pending' && status !== 'connected' && status !== 'expired' && status !== 'denied') throw new Error('Invalid Platform device status.')
  return { status, retryAfter }
}

export async function signOutHostedCodex(context: APIContext) {
  const connection = getHostedCodexConnection(context)
  if (connection) {
    const result = await responseJson(await fetchHostedCodex(connection, '', 'DELETE', context.request.signal))
    if (result.connected !== false) throw new Error('Platform did not disconnect the account.')
    context.cookies.delete(connectionCookie, cookieOptions)
  }
  return { disconnected: true }
}
