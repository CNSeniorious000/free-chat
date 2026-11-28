import type { APIRoute } from 'astro'

import { ChatError } from '@/lib/server/chat-providers'
import { hostedCodexConnected, isHostedCodexRequest, pollHostedCodex, signOutHostedCodex, startHostedCodexDevice } from '@/lib/server/codex-platform'
import { getSiwcAccounts, isLocalSiwcRequest, isSameOriginChatRequest, selectSiwcAccount, signOutSiwc, SiwcAccountError, siwcHeaders, startSiwcLogin } from '@/lib/server/siwc'
import { readSiwcRequestJson } from '@/lib/server/siwc-request'

const json = (body: object, status = 200, retryAfter?: number) => Response.json(body, { status, headers: retryAfter === undefined ? siwcHeaders : { ...siwcHeaders, 'Retry-After': String(retryAfter) } })
const fail = (status: number, code: string, message: string) => json({ error: { code, message } }, status)
const unavailable = () => fail(404, 'siwc_unavailable', 'ChatGPT sign-in is available only on the local free-chat server at 127.0.0.1.')
const forbidden = () => fail(403, 'origin_denied', 'Cross-origin request denied.')
const invalidAction = () => fail(400, 'invalid_action', 'Invalid action.')
const hostedAccount = { id: 'platform-codex', label: 'ChatGPT', connected: true }

export const GET: APIRoute = async(context) => {
  const hosted = isHostedCodexRequest(context)
  if (!hosted && !isLocalSiwcRequest(context)) return unavailable()
  const fetchSite = context.request.headers.get('sec-fetch-site')
  if (fetchSite === 'cross-site' || fetchSite === 'same-site' || (context.request.headers.has('origin') && !isSameOriginChatRequest(context))) return forbidden()
  try {
    if (hosted) return json(await hostedCodexConnected(context) ? { accounts: [hostedAccount], activeAccountId: hostedAccount.id } : { accounts: [] })
    return json(await getSiwcAccounts())
  } catch {
    return fail(500, 'siwc_unavailable', 'Could not read your ChatGPT accounts.')
  }
}

export const POST: APIRoute = async(context) => {
  const hosted = isHostedCodexRequest(context)
  if (!hosted && !isLocalSiwcRequest(context)) return unavailable()
  if (!isSameOriginChatRequest(context)) return forbidden()
  if (context.request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return fail(415, 'invalid_content_type', 'Expected JSON.')
  try {
    const body: unknown = hosted ? await readSiwcRequestJson(context.request, 4096) : await context.request.json().catch(() => null)
    if (!body || typeof body !== 'object' || !('action' in body)) return invalidAction()
    const accountId = 'accountId' in body ? body.accountId : undefined
    if (accountId !== undefined && (typeof accountId !== 'string' || !accountId)) return fail(400, 'invalid_account', 'Invalid account ID.')
    if (hosted) {
      if (body.action === 'login') return json({ device: await startHostedCodexDevice(context) })
      if (body.action === 'logout') return json(await signOutHostedCodex(context))
      if (body.action === 'poll') {
        const { status, retryAfter } = await pollHostedCodex(context)
        return json({ status }, 200, retryAfter)
      }
      return invalidAction()
    }
    if (body.action === 'login') return json({ url: await startSiwcLogin(context, accountId) })
    if (body.action === 'logout') return json(await signOutSiwc(accountId))
    if (body.action === 'select' && accountId) {
      await selectSiwcAccount(accountId)
      return json({})
    }
    return invalidAction()
  } catch(error) {
    if (error instanceof ChatError) return fail(error.status, error.code, error.message)
    if (error instanceof SiwcAccountError) return fail(400, 'invalid_account', error.message)
    return fail(500, 'siwc_unavailable', 'Could not update your ChatGPT account.')
  }
}
