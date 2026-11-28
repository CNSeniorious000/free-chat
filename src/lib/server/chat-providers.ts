import type { EventSourceMessage } from 'eventsource-parser'

import { EventSourceParserStream } from 'eventsource-parser/stream'

import type { ChatMessage, ErrorMessage } from '@/types'

export interface SiwcChatInput {
  messages: ChatMessage[]
  model?: string
}

type ChatEvent = { delta: string } | { done: true } | { error: ErrorMessage }

const siwcBaseUrl = 'https://api.openai.com/v1'
const streamHeaders = { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' }
const encoder = new TextEncoder()
const encodeEvent = (event: ChatEvent) => encoder.encode(`data: ${JSON.stringify(event)}\n\n`)

const siwcErrors: Record<string, string> = {
  subscription_sharing_user_not_eligible: '此 ChatGPT 账号或工作区无法使用订阅额度。',
  subscription_sharing_usage_limit_exceeded: '已达到 ChatGPT 订阅使用限制。',
  subscription_sharing_usage_unavailable: '暂时无法查询 ChatGPT 订阅用量，请稍后重试。',
  subscription_sharing_unsupported_capability: 'ChatGPT 订阅不支持当前模型或请求。',
  subscription_sharing_route_not_supported: 'ChatGPT 订阅不支持此接口。',
  subscription_sharing_invalid_user: 'OpenAI 无法验证当前 ChatGPT 账号，请检查登录状态。',
  chatpass_v2_scope_not_authorized: '当前 ChatGPT 授权不允许使用订阅额度，请检查授权。',
  chatpass_v2_invalid_authorization_context: '无法验证当前 ChatGPT 授权，请检查登录状态。',
  subscription_sharing_user_unavailable: '暂时无法获取 ChatGPT 账号信息，请稍后重试。',
  context_length_exceeded: '对话超出所选模型的上下文限制。',
  insufficient_quota: '当前 ChatGPT 账号的额度不足。',
  invalid_api_key: 'OpenAI 未接受当前 ChatGPT 登录凭证。',
  model_not_found: '当前 ChatGPT 账号无法使用所选模型。',
  rate_limit_exceeded: '触发了请求频率限制，请稍后重试。',
}

export class ChatError extends Error {
  constructor(readonly status: number, readonly code: string, message: string, readonly requestId?: string) {
    super(message)
  }

  get data() {
    return { code: this.code, message: this.message }
  }
}

function upstreamError(status: number, code?: unknown, requestId?: string) {
  if (typeof code === 'string' && Object.hasOwn(siwcErrors, code)) return new ChatError(status, code, siwcErrors[code], requestId)

  if (status === 401) return new ChatError(status, 'upstream_unauthorized', 'OpenAI 未接受当前 ChatGPT 登录或授权，请检查登录状态。', requestId)
  if (status === 403) return new ChatError(status, 'upstream_forbidden', 'OpenAI 策略或权限不允许本次请求。', requestId)
  if (status === 429) return new ChatError(status, 'upstream_rate_limited', '触发了请求频率限制，请稍后重试。', requestId)
  if (status === 503) return new ChatError(status, 'upstream_unavailable', 'OpenAI 暂时不可用，请稍后重试。', requestId)
  return new ChatError(status, 'upstream_error', 'OpenAI 未能完成请求。', requestId)
}

async function fetchUpstream(token: string, path: '/models' | '/responses', signal: AbortSignal, payload?: object) {
  const headers = new Headers({ Accept: payload ? 'text/event-stream' : 'application/json', Authorization: `Bearer ${token}` })
  if (payload) headers.set('Content-Type', 'application/json')

  let response: Response
  try {
    response = await fetch(`${siwcBaseUrl}${path}`, { method: payload ? 'POST' : 'GET', body: payload ? JSON.stringify(payload) : undefined, headers, redirect: 'error', signal })
  } catch {
    throw new ChatError(502, 'upstream_unreachable', '无法连接 OpenAI。')
  }

  const id = response.headers.get('x-request-id')
  const requestId = id && /^[\w-]{1,128}$/.test(id) ? id : undefined
  if (!response.ok) {
    const failure = await response.json().catch(() => null) as { error?: { code?: unknown } } | null
    throw upstreamError(response.status, failure?.error?.code, requestId)
  }
  return { response, requestId }
}

export async function listSiwcModels(token: string | undefined, signal: AbortSignal) {
  if (!token) return []

  const { response, requestId } = await fetchUpstream(token, '/models', signal)
  const result = await response.json().catch(() => null) as { models?: { visibility?: unknown, slug?: unknown, display_name?: unknown }[] } | null
  if (!Array.isArray(result?.models)) throw new ChatError(502, 'invalid_catalog', 'OpenAI 未返回可用的模型列表。', requestId)

  return result.models.flatMap(model => model?.visibility === 'list' && typeof model.slug === 'string' && model.slug
    ? [{ id: model.slug, name: typeof model.display_name === 'string' && model.display_name ? model.display_name : model.slug }]
    : [])
}

function readUpstreamEvent({ data, event }: EventSourceMessage): ChatEvent | undefined {
  if (data === '[DONE]') return

  const chunk = JSON.parse(data) as {
    type?: string
    delta?: unknown
    code?: unknown
    error?: { code?: unknown }
    response?: { error?: { code?: unknown } }
  }
  const type = chunk.type ?? event
  if (chunk.error || type === 'error' || type === 'response.failed')
    throw upstreamError(502, chunk.error?.code ?? chunk.response?.error?.code ?? chunk.code)
  if (type === 'response.completed') return { done: true }
  if (type === 'response.incomplete') throw new ChatError(502, 'incomplete_response', '模型未完成回复。')
  if ((type === 'response.output_text.delta' || type === 'response.refusal.delta') && typeof chunk.delta === 'string') return { delta: chunk.delta }
}

export async function streamSiwcChat(token: string | undefined, chat: SiwcChatInput, signal: AbortSignal) {
  if (!token) throw new ChatError(401, 'sign_in_required', '请登录 ChatGPT 并授权使用订阅额度。')
  const model = chat.model ?? (await listSiwcModels(token, signal))[0]?.id
  if (!model) throw new ChatError(403, 'no_models', '此 ChatGPT 账号没有可用模型。')

  const input = chat.messages.map(({ role, content }) => ({ role: role === 'system' ? 'developer' : role, content }))
  const { response, requestId } = await fetchUpstream(token, '/responses', signal, { model, input, store: false, stream: true })
  if (!response.body) throw new ChatError(502, 'missing_stream', 'OpenAI 未返回回复流。', requestId)

  const reader = response.body.pipeThrough(new TextDecoderStream()).pipeThrough(new EventSourceParserStream({ maxBufferSize: 1024 * 1024 })).getReader()
  const cancel = () => reader.cancel().catch(() => {})
  let cancelled = false
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        while (true) {
          const { value, done } = await reader.read()
          if (cancelled) return
          if (done) throw new ChatError(502, 'missing_completion', '回复流在确认完成前中断。')
          const event = readUpstreamEvent(value)
          if (!event) continue
          controller.enqueue(encodeEvent(event))
          if ('done' in event) {
            controller.close()
            void cancel()
          }
          return
        }
      } catch(error) {
        if (cancelled) return
        if (!signal.aborted) controller.enqueue(encodeEvent({ error: error instanceof ChatError ? error.data : { code: 'stream_interrupted', message: 'OpenAI 回复流中断。' } }))
        controller.close()
        void cancel()
      }
    },
    cancel() {
      cancelled = true
      return cancel()
    },
  })

  const headers = new Headers(streamHeaders)
  if (requestId) headers.set('X-Request-Id', requestId)
  return new Response(stream, { headers })
}
