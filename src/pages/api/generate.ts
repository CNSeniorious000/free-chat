// #vercel-disable-blocks
import { ProxyAgent, fetch } from 'undici'
// #vercel-end
import { generatePayload, parseOpenAIStream } from '@/utils/openAI'
import { verifySignature } from '@/utils/auth'
import { countTokensServer } from '@/utils/tiktoken-server'
import type { APIRoute } from 'astro'

const apiKey = import.meta.env.OPENAI_API_KEY
const httpsProxy = import.meta.env.HTTPS_PROXY
const baseUrl = ((import.meta.env.OPENAI_API_BASE_URL) || 'https://api.openai.com').trim().replace(/\/$', '')
const sitePassword = import.meta.env.SITE_PASSWORD
const ua = import.meta.env.UNDICI_UA

const FORWARD_HEADERS = ['origin', 'referer', 'cookie', 'user-agent', 'via']

const minMessages = 3
const maxTokens = 4096

export const post: APIRoute = async({ request }) => {

const apiKey = import.meta.env.OPENAI_API_KEY
const httpsProxy = import.meta.env.HTTPS_PROXY
const baseUrl = ((import.meta.env.OPENAI_API_BASE_URL) || 'https://api.openai.com').trim().replace(/\/$/, '')
const sitePassword = import.meta.env.SITE_PASSWORD
const ua = import.meta.env.UNDICI_UA

const FORWARD_HEADERS = ['origin', 'referer', 'cookie', 'user-agent', 'via']

export const post: APIRoute = async({ request }) => {
  const body = await request.json()
  const { sign, time, messages, pass, model } = body
  if (!messages) {
    return new Response(JSON.stringify({
      error: {
        message: 'No input text.',
      },
    }), { status: 400 })
  }
  if (sitePassword && sitePassword !== pass) {
    return new Response(JSON.stringify({
      error: {
        message: 'Invalid password.',
      },
    }), { status: 401 })
  }
  if (import.meta.env.PROD && !await verifySignature({ t: time, m: messages?.[messages.length - 1]?.content || '' }, sign)) {
    return new Response(JSON.stringify({
      error: {
        message: 'Invalid signature.',
      },
    }), { status: 401 })
  }

  // Token counting and trimming logic
  let trimmedMessages = [...messages]
  let tokenCount = countTokensServer(null, trimmedMessages).total
  while (tokenCount > maxTokens && trimmedMessages.length > minMessages) {
    trimmedMessages.shift()
    tokenCount = countTokensServer(null, trimmedMessages).total
  }

  const initOptions = generatePayload(request.headers.get('Authorization') ?? `Bearer ${apiKey}`, trimmedMessages, model)

  const headers = initOptions.headers

  if (baseUrl) request.headers.forEach((val, key) => (FORWARD_HEADERS.includes(key) || key.startsWith('sec-') || key.startsWith('x-')) && (headers[key] = val))

  if (ua) headers['user-agent'] = ua

  // #vercel-disable-blocks
  if (httpsProxy) initOptions.dispatcher = new ProxyAgent(httpsProxy)
  // #vercel-end

  const response = await fetch(`${baseUrl}/v1/chat/completions`, initOptions).catch((err: Error) => {
    console.error(err)
    return new Response(JSON.stringify({
      error: {
        code: err.name,
        message: err.message,
      },
    }), { status: 500 })
  }) as Response

  return parseOpenAIStream(response)
}
