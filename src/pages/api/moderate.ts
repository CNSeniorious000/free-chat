import type { APIRoute } from 'astro'

const baseUrl = ((import.meta.env.OPENAI_API_BASE_URL) || 'https://api.openai.com').trim().replace(/\/$/, '')
const ua = import.meta.env.UNDICI_UA

const FORWARD_HEADERS = ['origin', 'referer', 'cookie', 'user-agent', 'via']

export const post: APIRoute = async({ request }) => {
  const input = await request.text()

  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'Authorization': request.headers.get('Authorization') ?? '' }

  if (baseUrl) request.headers.forEach((val, key) => (FORWARD_HEADERS.includes(key) || key.startsWith('sec-') || key.startsWith('x-')) && (headers[key] = val))

  if (ua) headers['user-agent'] = ua

  const body = JSON.stringify({ model: 'text-moderation-latest', input })

  const response = await fetch(`${baseUrl}/v1/moderations`, { method: 'POST', headers, body }).catch((err: Error) => {
    console.error(err)

    return new Response(JSON.stringify({
      error: {
        code: err.name,
        message: err.message,
      },
    }), { status: 500 })
  })

  if (!response.ok) return response

  const { results: [{ categories, category_scores }] } = await response.json()

  const flags = Object.keys(categories).filter(key => categories[key])

  return new Response(JSON.stringify({ flags, scores: category_scores }), { headers: { 'content-type': 'application/json' } })
}
