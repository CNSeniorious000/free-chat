import type { ChatMessage } from '@/types'
import type { Tiktoken } from 'tiktoken'

const countTokensSingleMessage = (enc: Tiktoken, message: ChatMessage) => {
  return 4 + enc.encode(message.content).length // im_start, im_end, role/name, "\n"
}

export const countTokens = (enc: Tiktoken, messages: ChatMessage[]) => {
  if (messages.length === 0) return

  const lastMsg = messages.at(-1)
  const context = messages.slice(0, -1)

  const countTokens: (message: ChatMessage) => number = countTokensSingleMessage.bind(null, enc)

  const countLastMsg = countTokens(lastMsg!)
  const countContext = context.map(countTokens).reduce((a, b) => a + b, 3) // im_start, "assistant", "\n"

  return { countContext, countLastMsg, total: countContext + countLastMsg }
}

const cl100k_base_json = import.meta.env.PUBLIC_CL100K_BASE_JSON_URL
const tiktoken_bg_wasm = 'https://dogecloud.muspimerol.site/tiktoken_bg.wasm'

async function getBPE() {
  return cl100k_base_json ? fetch(cl100k_base_json).then(r => r.json()) : import('tiktoken/encoders/cl100k_base.json')
}

export const initTikToken = async() => {
  const { init } = await import('tiktoken/lite/init')
  const [{ bpe_ranks, special_tokens, pat_str }, { Tiktoken }] = await Promise.all([
    getBPE(),
    import('tiktoken/lite/init'),
    fetch(tiktoken_bg_wasm).then(r => r.arrayBuffer()).then(wasm => init(imports => WebAssembly.instantiate(wasm, imports))),
  ])
  return new Tiktoken(bpe_ranks, special_tokens, pat_str)
}
