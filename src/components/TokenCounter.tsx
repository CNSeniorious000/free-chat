import { Show, createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { countTokens, initTikToken } from '../utils/tiktoken'
import type { Tiktoken } from 'tiktoken/lite'
import type { Accessor } from 'solid-js'
import type { ChatMessage } from '@/types'

interface Props {
  currentSystemRoleSettings: Accessor<string>
  messageList: Accessor<ChatMessage[]>
  textAreaValue: Accessor<string>
  currentAssistantMessage: Accessor<string>
  hide: boolean
}

const HIDE_TIMEOUT = 5000
export const [encoder, setEncoder] = createSignal<Tiktoken | null>(null)

export default (props: Props) => {
  const [isHide, setHide] = createSignal(true)
  let hideTimer: NodeJS.Timeout | null = null

  const { currentSystemRoleSettings, messageList, textAreaValue, currentAssistantMessage } = props

  onMount(() => {
    initTikToken().then((tiktoken) => {
      setEncoder(tiktoken)
    })

    onCleanup(() => {
      encoder()?.free()
    })
  })

  const getTokensUsage = createMemo(() => {
    if (!encoder()) return

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

    const result = countTokens(encoder()!, messages)

    setHide(false)

    clearTimeout(hideTimer!)
    hideTimer = setTimeout(() => setHide(true), HIDE_TIMEOUT)

    return result
  })

  return (
    <Show when={encoder()}>
      <section class="absolute bottom-17 z-1 select-none self-center transition-opacity duration-400 sm:bottom-20" class:op-0={isHide() || props.hide || !(messageList().length || textAreaValue())}>
        <div class="fcc gap-1 rounded-full bg-[#e5e5e5a0] px-2.8 py-1.9 text-xs dark:bg-[#373740a0] !backdrop-blur-20 <md:transition-background-color">
          <span class="translate-y-0.2">{getTokensUsage()?.total ?? 0}</span>
          <span class="translate-y-0.2">tokens</span>
        </div>
      </section>
    </Show>
  )
}
