import type { APIRoute } from 'astro'

import { completeSiwcLogin, isLocalSiwcRequest, siwcHeaders } from '@/lib/server/siwc'

export const GET: APIRoute = async(context) => {
  if (!isLocalSiwcRequest(context) || context.request.method !== 'GET') return new Response(null, { status: 404, headers: siwcHeaders })
  const result = await completeSiwcLogin(context).catch(() => 'error' as const)
  return new Response(null, { status: 303, headers: { ...siwcHeaders, Location: `/?siwc=${result}` } })
}
