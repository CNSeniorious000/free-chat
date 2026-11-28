import { ChatError } from './chat-providers'

export async function readSiwcRequestJson(request: Request, maxBytes = 512 * 1024): Promise<unknown> {
  if (request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/json')
    throw new ChatError(415, 'invalid_content_type', '请以 JSON 发送对话请求。')
  const reader = request.body?.getReader()
  if (!reader) throw new ChatError(400, 'invalid_json', '缺少对话请求。')

  const decoder = new TextDecoder()
  let text = ''
  let size = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) return JSON.parse(text + decoder.decode())
      size += value.byteLength
      if (size > maxBytes) {
        await reader.cancel().catch(() => {})
        throw new ChatError(413, 'request_too_large', '对话请求过大。')
      }
      text += decoder.decode(value, { stream: true })
    }
  } catch(error) {
    if (error instanceof ChatError) throw error
    throw new ChatError(400, 'invalid_json', '无法解析对话请求。')
  } finally {
    reader.releaseLock()
  }
}
