import type { APIContext, APIRoute } from 'astro'

import type { ChatInput } from '@/lib/server/chat-providers'
import type { ChatMessage, ChatModelSelection } from '@/types'

import { ChatError, chatProvider, getProviderConfig, listChatModels, requiresLocalChat, streamChat } from '@/lib/server/chat-providers'
import { getSiwcAccessToken, isLocalChatRequest, isSameOriginChatRequest } from '@/lib/server/siwc'
import { MAX_CHAT_MESSAGES } from '@/types'

function checkAccess(context: APIContext) {
  if (requiresLocalChat && !isLocalChatRequest(context))
    throw new ChatError(403, 'local_provider_only', '此供应商仅可通过本机的 127.0.0.1 访问。')

  const { method, headers } = context.request
  // For keyless compatible providers, fetch metadata also works behind a proxy where Astro normalizes the request URL.
  const sameOriginFetch = (method === 'GET' || !requiresLocalChat) && headers.get('sec-fetch-site') === 'same-origin'
  if ((method === 'POST' || chatProvider === 'siwc') && !sameOriginFetch && !isSameOriginChatRequest(context))
    throw new ChatError(403, 'invalid_origin', '请在 Free Chat 页面内访问此接口。')
}

function errorResponse(error: unknown) {
  const failure = error instanceof ChatError ? error : new ChatError(503, 'chat_unavailable', '暂时无法使用对话供应商，请稍后重试。')
  const headers = new Headers({ 'Cache-Control': 'no-store' })
  if (failure.requestId) headers.set('X-Request-Id', failure.requestId)
  return Response.json({ provider: chatProvider, error: failure.data }, { status: failure.status, headers })
}

async function readJson(request: Request): Promise<unknown> {
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
      if (size > 512 * 1024) {
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

function isChatMessage(value: unknown): value is ChatMessage {
  return !!value && typeof value === 'object' && 'role' in value && (value.role === 'system' || value.role === 'user' || value.role === 'assistant') && 'content' in value && typeof value.content === 'string'
}

async function readChatInput(request: Request): Promise<ChatInput> {
  const payload = await readJson(request)
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new ChatError(400, 'invalid_request', '无效的对话请求。')
  const { messages, purpose = 'chat', selection, temperature } = payload as Record<string, unknown>

  if (!Array.isArray(messages) || messages.length > MAX_CHAT_MESSAGES || !messages.every(isChatMessage) || !messages.some(message => message.role === 'user' && message.content.trim()))
    throw new ChatError(400, 'invalid_messages', '请提供有效的对话消息。')
  if (purpose !== 'chat' && purpose !== 'suggest' && purpose !== 'title' && purpose !== 'translate')
    throw new ChatError(400, 'invalid_purpose', '不支持此对话用途。')
  if (temperature !== undefined && (typeof temperature !== 'number' || !Number.isFinite(temperature)))
    throw new ChatError(400, 'invalid_temperature', 'Temperature 必须是有限数值。')

  let modelSelection: ChatModelSelection | undefined
  if (selection !== undefined) {
    const { provider, model } = selection && typeof selection === 'object' ? selection as Record<string, unknown> : {}
    if ((provider !== 'siwc' && provider !== 'openai-compatible') || typeof model !== 'string' || !model.trim() || model.length > 256)
      throw new ChatError(400, 'invalid_model', '请选择有效的模型。')
    if (provider === chatProvider) modelSelection = { provider, model: model.trim() }
  }

  return { messages: messages.map(({ role, content }) => ({ role, content })), purpose, selection: modelSelection, temperature }
}

async function getConfig() {
  return getProviderConfig(chatProvider === 'siwc' ? await getSiwcAccessToken() : undefined)
}

export const GET: APIRoute = async(context) => {
  try {
    checkAccess(context)
    const config = await getConfig()
    const models = await listChatModels(config, context.request.signal)
    return Response.json({ provider: chatProvider, models }, { headers: { 'Cache-Control': 'no-store' } })
  } catch(error) {
    return errorResponse(error)
  }
}

export const POST: APIRoute = async(context) => {
  try {
    checkAccess(context)
    const input = await readChatInput(context.request)
    return await streamChat(await getConfig(), input, context.request.signal)
  } catch(error) {
    return errorResponse(error)
  }
}
