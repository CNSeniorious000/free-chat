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

const alignRightMine = !!import.meta.env.PUBLIC_RIGHT_ALIGN_MY_MSG

export default ({ role, message, showRetry, onRetry }: Props) => {
  const roleClass = {
    user: 'bg-$c-fg-30',
    assistant: 'bg-[#bfd858] dark:bg-$c-fg dark:sm:(bg-[#bfd858] ring-2 ring-inset ring-white)',
  }
  const [source] = createSignal('')
  const { copy, copied } = useClipboard({ source, copiedDuring: 1000 })

  useEventListener('click', (e) => {
    const el = e.target as HTMLElement
    let code = null

    if (el.matches('[data-code]')) {
      code = decodeURIComponent(el.dataset.code)
      copy(code)
    }
    if (el.matches('[data-code] > div')) {
      code = decodeURIComponent(el.parentElement?.dataset.code)
      copy(code)
    }
  })

  const htmlString = () => {
    const md = MarkdownIt({
      linkify: true,
      breaks: true,
    }).use(mdKatex).use(mdHighlight)
    const fence = md.renderer.rules.fence
    md.renderer.rules.fence = (...args) => {
      const [tokens, idx] = args
      const token = tokens[idx]
      const rawCode = fence(...args)

      return `<div class="relative group">
        <div data-code=${encodeURIComponent(token.content)} class="gpt-copy-btn">
          ${copied() ? '<div mr-1 text-sm display-inline-block>Copied!</div><div i-mingcute-copy-2-fill></div>' : '<div i-mingcute-copy-2-line></div>'}
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
    <div class="-mx-20 px-20 transition-colors md:(-mx-5 px-5) md:transition-background-color 2xl:(-mx-20 px-20) hover:bg-$c-fg-2 ">
      <div class="py-0.5 transition-padding md:py-1 2xl:py-2">
        <div class="rounded-lg flex gap-3.5" class:op-75={role === 'user'} class:reverse-self-msg={role === 'user' && alignRightMine}>
          <div class={`shrink-0 w-7 h-7 my-4 rounded-full ${roleClass[role]} <sm:w-1 <sm:h-auto <md:transition-background-color`} />
          <div class="max-w-full relative message prose break-words overflow-hidden <sm:text-3.6" innerHTML={htmlString()} />
        </div>
        {showRetry?.() && onRetry && (
        <div class="mb-2 px-3 fie">
          <div onClick={onRetry} class="gpt-retry-btn">
            <IconRefresh />
            <span select-none>重新生成</span>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
