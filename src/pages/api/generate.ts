// #vercel-disable-blocks
import { ProxyAgent, fetch } from 'undici'
// #vercel-end
import { generatePayload, parseOpenAIStream } from '@/utils/openAI'
import { verifySignature } from '@/utils/auth'
import type { APIRoute } from 'astro'

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

  
// Initialize tiktoken-js and obtain an encoder instance
const encoder = new Encoder('en');  // Assuming 'en' is the language code used

// Define minMessages and maxTokens
const minMessages = 5;  // Example value, adjust as needed
const maxTokens = 1024;  // Example value, adjust as needed

// Function to count tokens for a message using tiktoken-js
function countTokens(message) {
    return encoder.encode(message).length;
}

// Message truncation logic
// Ensure to trim messages from the start but keep at least minMessages
let totalTokens = messages.reduce((sum, msg) => sum + countTokens(msg.content), 0);
while (totalTokens > maxTokens && messages.length > minMessages) {
    totalTokens -= countTokens(messages[0].content);  // Subtract tokens of the first message
    messages.shift();  // Remove the first message from the array
}

const initOptions = generatePayload(request.headers.get('Authorization') ?? `Bearer ${apiKey}`, messages, model);


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
