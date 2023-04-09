import { createSignal } from 'solid-js'
import MarkdownIt from 'markdown-it'
import mdKatex from 'markdown-it-katex'
import mdHighlight from 'markdown-it-highlightjs'
import { useClipboard, useEventListener } from 'solidjs-use'
import IconRefresh from './icons/Refresh'
import type { Accessor } from 'solid-js'
import type { ChatMessage } from '@/types'

interface Props {
  role: ChatMessage['role']
  message: Accessor<string> | string
  showRetry?: Accessor<boolean>
  onRetry?: () => void
}

export default ({ role, message, showRetry, onRetry }: Props) => {
  const roleClass = {
    system: 'bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300',
    user: 'bg-gradient-to-r from-purple-400 to-yellow-400',
    assistant: 'bg-gradient-to-r from-yellow-200 via-green-200 to-green-300',
  }
  const [source] = createSignal('')
  const { copy, copied } = useClipboard({ source, copiedDuring: 1000 })

  useEventListener('click', (e) => {
    const el = e.target as HTMLElement
    let code = null

    if (el.matches('div > div.copy-btn')) {
      code = decodeURIComponent(el.dataset.code!)
      copy(code)
    }
    if (el.matches('div > div.copy-btn > div')) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      code = decodeURIComponent(el.parentElement?.dataset.code!)
      copy(code)
    }
  })

  const htmlString = () => {
    const md = MarkdownIt({
      linkify: true,
      breaks: true,
    }).use(mdKatex).use(mdHighlight)
    const fence = md.renderer.rules.fence!
    md.renderer.rules.fence = (...args) => {
      const [tokens, idx] = args
      const token = tokens[idx]
      const rawCode = fence(...args)

      return `<div relative>
      <div data-code=${encodeURIComponent(token.content)} class="copy-btn gpt-copy-btn group hover:filter-brightness-90 dark:hover:filter-brightness-115 active:scale-90 transition-all duration-150">
        ${copied() ? '<span mr-1 text-sm display-none group-hover:display-inline-block>Copied!</span><div i-mingcute-copy-2-fill></div>' : '<div i-mingcute-copy-2-line></div>'}
      </div>
      ${rawCode}
      </div>`
    }

    if (typeof message === 'function')
      return md.render(message())
    else if (typeof message === 'string')
      return md.render(message)

    return ''
  }

  return (
    <div class="py-2 -mx-20 px-20 md:(-mx-4 px-4) lg:(-mx-20 px-20) transition-background-color hover:bg-$c-fg-2">
      <div class="flex gap-3 rounded-lg" class:op-75={role === 'user'}>
        <div class={`shrink-0 w-7 h-7 mt-4 rounded-full op-80 ${roleClass[role]}`} />
        <div class="message prose break-words overflow-hidden max-w-full" innerHTML={htmlString()} />
      </div>
      {showRetry?.() && onRetry && (
        <div class="fie px-3 mb-2">
          <div onClick={onRetry} class="gpt-retry-btn">
            <IconRefresh />
            <span select-none>重新生成</span>
          </div>
        </div>
      )}
    </div>
  )
}
