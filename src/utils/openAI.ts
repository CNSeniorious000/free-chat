import { createParser } from 'eventsource-parser'
import type { ParsedEvent, ReconnectInterval } from 'eventsource-parser'
import type { ChatMessage } from '@/types'

const model = import.meta.env.OPENAI_API_MODEL || 'gpt-3.5-turbo-16k'

export const generatePayload = (authorization: string, messages: ChatMessage[]): RequestInit & { dispatcher?: any } => ({
  headers: { 'Content-Type': 'application/json', authorization },
  method: 'POST',
  body: JSON.stringify({ model, messages, temperature: 0.6, stream: true }),
})

export const parseOpenAIStream = (rawResponse: Response) => {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const headers = Object.fromEntries(rawResponse.headers)
  delete headers['content-type']

  const initOptions = {
    status: rawResponse.status,
    statusText: rawResponse.statusText,
    headers,
  }

  if (!rawResponse.ok) return new Response(rawResponse.body, initOptions)

  const stream = new ReadableStream({
    async start(controller) {
      const streamParser = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data
          if (data === '[DONE]') {
            controller.close()
            return
          }
          try {
            const json = JSON.parse(data)
            const text = json.choices[0].delta?.content || ''
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          } catch (e) {
            controller.error(e)
          }
        }
      }

      const parser = createParser(streamParser)
      for await (const chunk of rawResponse.body as any)
        parser.feed(decoder.decode(chunk))
    },
  })

  return new Response(stream, initOptions)
}
