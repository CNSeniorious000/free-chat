import { fetch } from 'undici'
import type { APIRoute } from 'astro'

export const get: APIRoute = async() => {
  const res = await fetch(import.meta.env.PRESETS_URL)
  return new Response(await res.arrayBuffer(), { status: res.status, headers: res.headers as HeadersInit })
}
