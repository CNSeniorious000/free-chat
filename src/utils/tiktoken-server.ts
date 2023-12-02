import { Tiktoken } from 'tiktoken-js'
import type { ChatMessage } from '@/types'

const countTokensSingleMessage = (enc: Tiktoken, message: ChatMessage) => {
  return 4 + enc.encode(message.content).length
}

export const countTokensServer = (enc: Tiktoken | null, messages: ChatMessage[]) => {
  if (messages.length === 0 || !enc) return { total: Infinity }

  const lastMsg = messages.at(-1)
  const context = messages.slice(0, -1)

  const countTokens: (message: ChatMessage) => number = countTokensSingleMessage.bind(null, enc)

  const countLastMsg = countTokens(lastMsg!)
  const countContext = context.map(countTokens).reduce((a, b) => a + b, 3)

  return { countContext, countLastMsg, total: countContext + countLastMsg }
}

const cl100k_base_json = import.meta.env.PUBLIC_CL100K_BASE_JSON_URL || '/cl100k_base.json'

async function getBPE() {
  return fetch(cl100k_base_json).then(r => r.json())
}

export const initTikTokenServer = async() => {
  const [{ bpe_ranks, special_tokens, pat_str }] = await Promise.all([
    getBPE().catch(console.error),
  ])
  return new Tiktoken(bpe_ranks, special_tokens, pat_str)
}
