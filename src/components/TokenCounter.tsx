import { Show, createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { Portal } from 'solid-js/web'
import { countTokens, model } from '../utils/tiktoken'
import type { Accessor } from 'solid-js'
import type { ChatMessage } from '@/types'
import type { Tiktoken } from 'tiktoken'

interface Props {
  messageList: Accessor<ChatMessage[]>
  textAreaValue: Accessor<string>
  currentAssistantMessage: Accessor<string>
}

const HIDE_TIMEOUT = 5000

export default (props: Props) => {
  const [isHide, setHide] = createSignal(true)
  let hideTimer: NodeJS.Timeout | null = null

  const { messageList, textAreaValue, currentAssistantMessage } = props

  let enc: Tiktoken

  const [isTiktokenReady, setTiktokenReady] = createSignal(false)

  onMount(() => {
    import('tiktoken').then(({ encoding_for_model }) => {
      enc = encoding_for_model(model)
      setTiktokenReady(true)
    })

    onCleanup(() => {
      isTiktokenReady() && enc.free()
    })
  })

  const getTokensUsage = createMemo(() => {
    if (!isTiktokenReady()) return

    const messages: ChatMessage[] = []
    // following the existing conversation
    messages.push(...messageList())
    // maybe still streaming
    if (currentAssistantMessage()) messages.push({ role: 'assistant', content: currentAssistantMessage() })
    // or maybe still typing
    // (streaming and typing may be at the same time in the future)
    else if (textAreaValue()) messages.push({ role: 'user', content: textAreaValue() })

    const result = countTokens(enc, messages)

    clearTimeout(hideTimer)

    if (result) {
      setHide(false)
      hideTimer = setTimeout(() => setHide(true), HIDE_TIMEOUT)
    } else {
      setHide(true)
    }

    return result
  })

  return (
    <Portal mount={document.querySelector('footer')}>
      <Show when={isTiktokenReady()}>
        <section class="transition-opacity duration-400 select-none" class:op-0={isHide()}>
          <div class="text-xs gap-1 fcc">
            <span class="translate-y-0.2">{getTokensUsage()?.total ?? 0}</span>
            <span class="translate-y-0.2">tokens</span>
          </div>
        </section>
      </Show>
    </Portal>
  )
}
