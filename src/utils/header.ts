const apiKey = import.meta.env.OPENAI_API_KEY
const ua = import.meta.env.UNDICI_UA
const FORWARD_HEADERS = ['origin', 'referer', 'cookie', 'user-agent', 'via']

export const getHeaders = (request: Request) => {
  const headers: Record<string, string> = { Authorization: request.headers.get('Authorization') ?? `Bearer ${apiKey}` }
  if (import.meta.env.OPENAI_API_BASE_URL) request.headers.forEach((val, key) => (FORWARD_HEADERS.includes(key) || key.startsWith('sec-') || key.startsWith('x-')) && (headers[key] = val))
  if (ua) headers['User-Agent'] = ua
  return headers
}
