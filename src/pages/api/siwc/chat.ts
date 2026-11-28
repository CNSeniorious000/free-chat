import type { APIContext, APIRoute } from 'astro'

import type { SiwcChatInput } from '@/lib/server/chat-providers'
import type { ChatMessage } from '@/types'

import { ChatError, listSiwcModels, streamSiwcChat } from '@/lib/server/chat-providers'
import { getSiwcAccessToken, isLocalSiwcRequest, isSameOriginChatRequest, siwcHeaders } from '@/lib/server/siwc'

function checkAccess(context: APIContext) {
  if (!isLocalSiwcRequest(context))
    throw new ChatError(403, 'local_provider_only', 'ChatGPT 登录仅可通过本机的 127.0.0.1 使用。')

  const { method, headers } = context.request
  const sameOriginGet = method === 'GET' && !headers.has('origin') && headers.get('sec-fetch-site') === 'same-origin'
  if (!sameOriginGet && !isSameOriginChatRequest(context))
    throw new ChatError(403, 'invalid_origin', '请在 Free Chat 页面内访问此接口。')
}

function errorResponse(error: unknown) {
  const failure = error instanceof ChatError ? error : new ChatError(503, 'chat_unavailable', '暂时无法使用 ChatGPT，请稍后重试。')
  const headers = new Headers(siwcHeaders)
  if (failure.requestId) headers.set('X-Request-Id', failure.requestId)
  return Response.json({ error: failure.data }, { status: failure.status, headers })
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

async function readChatInput(request: Request): Promise<SiwcChatInput> {
  const payload = await readJson(request)
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new ChatError(400, 'invalid_request', '无效的对话请求。')
  const { messages, model } = payload as Record<string, unknown>

  if (!Array.isArray(messages) || messages.length > 256 || !messages.every(isChatMessage) || !messages.some(message => message.role === 'user' && message.content.trim()))
    throw new ChatError(400, 'invalid_messages', '请提供有效的对话消息。')
  if (model !== undefined && (typeof model !== 'string' || !model.trim() || model.length > 256))
    throw new ChatError(400, 'invalid_model', '请选择有效的模型。')
  return { messages, model: model?.trim() }
}

export const GET: APIRoute = async(context) => {
  try {
    checkAccess(context)
    const models = await listSiwcModels(await getSiwcAccessToken(), context.request.signal)
    return Response.json({ models }, { headers: siwcHeaders })
  } catch(error) {
    return errorResponse(error)
  }
}

export const POST: APIRoute = async(context) => {
  try {
    checkAccess(context)
    const input = await readChatInput(context.request)
    return await streamSiwcChat(await getSiwcAccessToken(), input, context.request.signal)
  } catch(error) {
    return errorResponse(error)
  }
}
