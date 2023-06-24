import type { ChatMessage } from '@/types'
import type { Tiktoken, TiktokenModel } from 'tiktoken'

export const model = (import.meta.env.OPENAI_API_MODEL || 'gpt-3.5-turbo') as TiktokenModel

const countTokensSingleMessage = (enc: Tiktoken, message: ChatMessage) => {
  return 4 + enc.encode(message.content).length // im_start, im_end, role/name, "\n"
}

export const countTokens = (enc: Tiktoken, messages: ChatMessage[]) => {
  if (messages.length === 0) return

  const lastMsg = messages.at(-1)
  const context = messages.slice(0, -1)

  const countTokens: (message?: ChatMessage) => number = countTokensSingleMessage.bind(null, enc)

  const countLastMsg = countTokens(lastMsg)
  const countContext = context.map(countTokens).reduce((a, b) => a + b, 3) // im_start, "assistant", "\n"

  return { countContext, countLastMsg, total: countContext + countLastMsg }
}
