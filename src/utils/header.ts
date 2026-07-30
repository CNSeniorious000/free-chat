import { OPENAI_API_BASE_URL, OPENAI_API_KEY, UNDICI_UA } from 'astro:env/server'

const apiKey = OPENAI_API_KEY
const ua = UNDICI_UA
const FORWARD_HEADERS = ['origin', 'referer', 'cookie', 'user-agent', 'via']

export const getHeaders = (request: Request) => {
  const auth = request.headers.get('Authorization') ?? (apiKey && `Bearer ${apiKey}`)
  const headers: Record<string, string> = auth ? { Authorization: auth } : {}
  if (OPENAI_API_BASE_URL) request.headers.forEach((val, key) => (FORWARD_HEADERS.includes(key) || key.startsWith('sec-') || key.startsWith('x-')) && (headers[key] = val))
  if (ua) headers['User-Agent'] = ua
  return headers
}
