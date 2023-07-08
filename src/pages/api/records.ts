import { fetch } from 'undici'
import type { APIRoute } from 'astro'

export const post: APIRoute = async({ request }) => {
  const res = await fetch(import.meta.env.RECORDS_URL, {
    method: 'POST',
    body: await request.arrayBuffer(),
    headers: request.headers,
  })

  return new Response(await res.arrayBuffer(), {
    status: res.status,
    headers: res.headers as HeadersInit,
  })
}

export const put: APIRoute = async({ request, url }) => {
  const res = await fetch(`${import.meta.env.RECORDS_URL}/${url.searchParams.get('recordId')}`, {
    method: 'PUT',
    body: await request.arrayBuffer(),
    headers: request.headers,
  })

  return new Response(null, {
    status: res.status,
    headers: res.headers as HeadersInit,
  })
}
