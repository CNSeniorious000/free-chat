import { Show, createEffect, createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { countTokens } from '../utils/tiktoken'
import type { Accessor } from 'solid-js'
import type { ChatMessage } from '@/types'
import type { Tiktoken } from 'tiktoken/lite'

interface Props {
  currentSystemRoleSettings: Accessor<string>
  messageList: Accessor<ChatMessage[]>
  textAreaValue: Accessor<string>
  currentAssistantMessage: Accessor<string>
}

const HIDE_TIMEOUT = 5000

export default (props: Props) => {
  const [isHide, setHide] = createSignal(false)
  let hideTimer: NodeJS.Timeout | null = null

  const { currentSystemRoleSettings, messageList, textAreaValue, currentAssistantMessage } = props

  let enc: Tiktoken

  const [isTiktokenReady, setTiktokenReady] = createSignal(false)

  createEffect(() => isTiktokenReady() && (hideTimer = setTimeout(() => setHide(true), HIDE_TIMEOUT)))

  onMount(() => {
    (async() => {
      const { Tiktoken, init } = await import('tiktoken/lite/init')
      const { bpe_ranks, special_tokens, pat_str } = await Promise.all([
        fetch('https://dogecloud.muspimerol.site/cl100k_base.json').then(r => r.json()),
        fetch('https://dogecloud.muspimerol.site/tiktoken_bg.wasm').then(r => r.arrayBuffer()).then(wasm => init(imports => WebAssembly.instantiate(wasm, imports))),
      ])[0]
      enc = new Tiktoken(bpe_ranks, special_tokens, pat_str)
      setTiktokenReady(true)
    })()

    onCleanup(() => {
      isTiktokenReady() && enc.free()
    })
  })

  const getTokensUsage = createMemo(() => {
    if (!isTiktokenReady()) return

    const messages: ChatMessage[] = []
    // begin with a unique system message
    if (currentSystemRoleSettings()) messages.push({ role: 'system', content: currentSystemRoleSettings() })
    // following the existing conversation
    messages.push(...messageList())
    // maybe still streaming
    if (currentAssistantMessage()) messages.push({ role: 'assistant', content: currentAssistantMessage() })
    // or maybe still typing
    // (streaming and typing may be at the same time in the future)
    else if (textAreaValue()) messages.push({ role: 'user', content: textAreaValue() })

    const result = countTokens(enc, messages)

    setHide(false)

    clearTimeout(hideTimer)
    hideTimer = setTimeout(() => setHide(true), HIDE_TIMEOUT)

    return result
  })

  return (
    <section class="transition-opacity bottom-17 animate-fade-in duration-400 animate-duration-400 select-none absolute self-center sm:bottom-20" class:op-0={isHide()}>
      <div class="rounded-full bg-[#e5e5e5a0] text-xs py-1.9 px-2.8 gap-1 fcc !backdrop-blur-20 <md:transition-background-color dark:bg-[#373740a0]">
        <Show when={isTiktokenReady()} fallback={<span i-svg-spinners-3-dots-fade />}>
          <span class="translate-y-0.2">{getTokensUsage()?.total ?? 0}</span>
          <span class="translate-y-0.2">tokens</span>
        </Show>
      </div>
    </section>
  )
}
