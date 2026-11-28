import { EventSourceParserStream } from 'eventsource-parser/stream'

import type { ChatMessage, ChatModelSelection, ChatProvider, ChatPurpose, ErrorMessage } from '@/types'

export interface ChatProviderInfo {
  provider: ChatProvider
  models?: { id: string, name: string }[]
  error?: ErrorMessage
}

export class ChatProviderError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
    this.name = 'ChatProviderError'
  }
}

export function getChatSelection(): ChatModelSelection | undefined {
  try {
    const selection = JSON.parse(localStorage.getItem('chatModelSelection') ?? 'null')
    if ((selection?.provider === 'siwc' || selection?.provider === 'openai-compatible') && typeof selection.model === 'string' && selection.model.trim()) return selection
  } catch {}
}

export function setChatSelection(provider: ChatProvider, model: string) {
  if (model) localStorage.setItem('chatModelSelection', JSON.stringify({ provider, model }))
  else localStorage.removeItem('chatModelSelection')
}

export async function getChatProvider(): Promise<ChatProviderInfo> {
  const response = await fetch('/api/chat', { cache: 'no-store' })
  return response.json()
}

export async function* iterateChat(messages: ChatMessage[], purpose: ChatPurpose = 'chat', signal?: AbortSignal) {
  const selection = getChatSelection()
  const savedTemperature = purpose === 'chat' ? localStorage.getItem('temperature') : null
  const temperature = savedTemperature?.trim() ? Number(savedTemperature) : Number.NaN
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages, purpose, selection, temperature: Number.isFinite(temperature) ? temperature : undefined }),
    signal,
  })
  if (!response.ok) {
    const result = await response.json().catch(() => undefined) as { error?: ErrorMessage } | undefined
    throw new ChatProviderError(result?.error?.code ?? String(response.status), result?.error?.message || response.statusText || '对话请求失败。')
  }
  if (!response.body) throw new ChatProviderError('empty_stream', '模型未返回内容。')

  const stream = response.body.pipeThrough(new TextDecoderStream()).pipeThrough(new EventSourceParserStream())
  for await (const { data } of stream) {
    const event = JSON.parse(data) as { delta?: string, done?: true, error?: ErrorMessage }
    if (event.error) throw new ChatProviderError(event.error.code, event.error.message)
    if (event.done) return
    if (event.delta) yield event.delta
  }
  throw new ChatProviderError('incomplete_stream', '模型的响应意外中断。')
}
