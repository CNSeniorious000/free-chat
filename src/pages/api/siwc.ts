import type { APIRoute } from 'astro'

import { getSiwcAccounts, isLocalSiwcRequest, isSameOriginChatRequest, selectSiwcAccount, signOutSiwc, SiwcAccountError, siwcHeaders, startSiwcLogin } from '@/lib/server/siwc'

const json = (body: object, status = 200) => Response.json(body, { status, headers: siwcHeaders })
const fail = (status: number, code: string, message: string) => json({ error: { code, message } }, status)
const unavailable = () => fail(404, 'siwc_unavailable', 'ChatGPT sign-in is available only on the local free-chat server with the SIWC provider.')
const forbidden = () => fail(403, 'origin_denied', 'Cross-origin request denied.')
const invalidAction = () => fail(400, 'invalid_action', 'Invalid action.')

export const GET: APIRoute = async(context) => {
  if (!isLocalSiwcRequest(context)) return unavailable()
  const fetchSite = context.request.headers.get('sec-fetch-site')
  if (fetchSite === 'cross-site' || fetchSite === 'same-site') return forbidden()
  try {
    return json(await getSiwcAccounts())
  } catch {
    return fail(500, 'siwc_unavailable', 'Could not read your ChatGPT accounts.')
  }
}

export const POST: APIRoute = async(context) => {
  if (!isLocalSiwcRequest(context)) return unavailable()
  if (!isSameOriginChatRequest(context)) return forbidden()
  if (context.request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return fail(415, 'invalid_content_type', 'Expected JSON.')
  const body: unknown = await context.request.json().catch(() => null)
  if (!body || typeof body !== 'object' || !('action' in body)) return invalidAction()
  const accountId = 'accountId' in body ? body.accountId : undefined
  if (accountId !== undefined && (typeof accountId !== 'string' || !accountId)) return fail(400, 'invalid_account', 'Invalid account ID.')
  try {
    if (body.action === 'login') return json({ url: await startSiwcLogin(context, accountId) })
    if (body.action === 'logout') return json(await signOutSiwc(accountId))
    if (body.action === 'select' && accountId) {
      await selectSiwcAccount(accountId)
      return json({})
    }
    return invalidAction()
  } catch(error) {
    if (error instanceof SiwcAccountError) return fail(400, 'invalid_account', error.message)
    return fail(500, 'siwc_unavailable', 'Could not update your ChatGPT account.')
  }
}
