import { EventSourceParserStream } from 'eventsource-parser/stream'

import type { ChatMessage, ErrorMessage } from '@/types'

export const siwcModelKey = 'siwc:model'

export function isSiwcOrigin() {
  return typeof window !== 'undefined' && window.location.protocol === 'http:' && window.location.hostname === '127.0.0.1'
}

export function isSiwcEnabled() {
  return isSiwcOrigin() && localStorage.getItem('siwc:enabled') === 'true'
}

export class SiwcChatError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
    this.name = 'SiwcChatError'
  }
}

export async function requireSiwcResponse(response: Response) {
  if (response.ok) return response
  const result = await response.json().catch(() => undefined) as { error?: ErrorMessage } | undefined
  throw new SiwcChatError(result?.error?.code ?? String(response.status), result?.error?.message ?? 'ChatGPT 请求失败。')
}

export async function* iterateSiwcChat(messages: ChatMessage[], signal: AbortSignal) {
  const response = await requireSiwcResponse(await fetch('/api/siwc/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages, model: localStorage.getItem(siwcModelKey) || undefined }),
    signal,
  }))
  if (!response.body) throw new SiwcChatError('empty_stream', '模型未返回内容。')

  const stream = response.body.pipeThrough(new TextDecoderStream()).pipeThrough(new EventSourceParserStream())
  for await (const { data } of stream) {
    const event = JSON.parse(data) as { delta?: string, done?: true, error?: ErrorMessage }
    if (event.error) throw new SiwcChatError(event.error.code, event.error.message)
    if (event.done) return
    if (event.delta) yield event.delta
  }
  throw new SiwcChatError('incomplete_stream', '模型的响应意外中断。')
}
