import type { ChatMessage } from '@/types'
import type { Tiktoken } from 'tiktoken'

export const tokenCountCache = new Map<string, number>()

const countTokensSingleMessage = (enc: Tiktoken, message: ChatMessage) => {
  return 4 + enc.encode(message.content).length // im_start, im_end, role/name, "\n"
}

const countTokensSingleMessageWithCache = (enc: Tiktoken, cacheIt: boolean, message: ChatMessage) => {
  if (tokenCountCache.has(message.content)) return tokenCountCache.get(message.content)!

  const count = countTokensSingleMessage(enc, message)
  if (cacheIt) tokenCountCache.set(message.content, count)
  return count
}

export const countTokens = (enc: Tiktoken, messages: ChatMessage[]) => {
  if (messages.length === 0) return

  if (!enc) return { total: Infinity }

  const lastMsg = messages.at(-1)
  const context = messages.slice(0, -1)

  const countTokens: (cacheIt: boolean, message: ChatMessage) => number = countTokensSingleMessageWithCache.bind(null, enc)

  const countLastMsg = countTokens(false, lastMsg!)
  const countContext = context.map(countTokens.bind(null, true)).reduce((a, b) => a + b, 3) // im_start, "assistant", "\n"

  return { countContext, countLastMsg, total: countContext + countLastMsg }
}

const cl100k_base_json = import.meta.env.PUBLIC_CL100K_BASE_JSON_URL || '/cl100k_base.json'
const tiktoken_bg_wasm = import.meta.env.PUBLIC_TIKTOKEN_BG_WASM_URL || '/tiktoken_bg.wasm'

async function getBPE() {
  return fetch(cl100k_base_json).then(r => r.json())
}

export const initTikToken = async() => {
  const { init } = await import('tiktoken/lite/init')
  const [{ bpe_ranks, special_tokens, pat_str }, { Tiktoken }] = await Promise.all([
    getBPE().catch(console.error),
    import('tiktoken/lite/init'),
    fetch(tiktoken_bg_wasm).then(r => r.arrayBuffer()).then(wasm => init(imports => WebAssembly.instantiate(wasm, imports))),
  ])
  return new Tiktoken(bpe_ranks, special_tokens, pat_str)
}
