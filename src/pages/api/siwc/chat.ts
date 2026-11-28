import type { APIContext, APIRoute } from 'astro'

import type { SiwcChatInput } from '@/lib/server/chat-providers'
import type { ChatMessage } from '@/types'

import { ChatError, listSiwcModels, streamSiwcChat } from '@/lib/server/chat-providers'
import { getHostedCodexConnection, isHostedCodexRequest } from '@/lib/server/codex-platform'
import { getSiwcAccessToken, isLocalSiwcRequest, isSameOriginChatRequest, siwcHeaders } from '@/lib/server/siwc'
import { readSiwcRequestJson } from '@/lib/server/siwc-request'
import { MAX_SIWC_MESSAGES } from '@/types'

function checkAccess(context: APIContext) {
  const hosted = isHostedCodexRequest(context)
  if (!hosted && !isLocalSiwcRequest(context))
    throw new ChatError(403, 'local_provider_only', 'ChatGPT 登录仅可通过本机的 127.0.0.1 使用。')

  const { method, headers } = context.request
  const sameOriginGet = method === 'GET' && !headers.has('origin') && headers.get('sec-fetch-site') === 'same-origin'
  if (!sameOriginGet && !isSameOriginChatRequest(context))
    throw new ChatError(403, 'invalid_origin', '请在 Free Chat 页面内访问此接口。')
  return hosted
}

function errorResponse(error: unknown) {
  const failure = error instanceof ChatError ? error : new ChatError(503, 'chat_unavailable', '暂时无法使用 ChatGPT，请稍后重试。')
  const headers = new Headers(siwcHeaders)
  if (failure.requestId) headers.set('X-Request-Id', failure.requestId)
  return Response.json({ error: failure.data }, { status: failure.status, headers })
}

async function getAccess(context: APIContext, hosted: boolean) {
  if (hosted) {
    const connection = getHostedCodexConnection(context)
    return connection ? { connection } : undefined
  }
  const token = await getSiwcAccessToken()
  return token ? { token } : undefined
}

function isChatMessage(value: unknown): value is ChatMessage {
  return !!value && typeof value === 'object' && 'role' in value && (value.role === 'system' || value.role === 'user' || value.role === 'assistant') && 'content' in value && typeof value.content === 'string'
}

async function readChatInput(request: Request): Promise<SiwcChatInput> {
  const payload = await readSiwcRequestJson(request)
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new ChatError(400, 'invalid_request', '无效的对话请求。')
  const { messages, model } = payload as Record<string, unknown>

  if (!Array.isArray(messages) || messages.length > MAX_SIWC_MESSAGES || !messages.every(isChatMessage) || !messages.some(message => message.role === 'user' && message.content.trim()))
    throw new ChatError(400, 'invalid_messages', '请提供有效的对话消息。')
  if (model !== undefined && (typeof model !== 'string' || !model.trim() || model.length > 256))
    throw new ChatError(400, 'invalid_model', '请选择有效的模型。')
  return { messages, model: model?.trim() }
}

export const GET: APIRoute = async(context) => {
  try {
    const hosted = checkAccess(context)
    const models = await listSiwcModels(await getAccess(context, hosted), context.request.signal)
    return Response.json({ models }, { headers: siwcHeaders })
  } catch(error) {
    return errorResponse(error)
  }
}

export const POST: APIRoute = async(context) => {
  try {
    const hosted = checkAccess(context)
    const input = await readChatInput(context.request)
    return await streamSiwcChat(await getAccess(context, hosted), input, context.request.signal)
  } catch(error) {
    return errorResponse(error)
  }
}
