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
    system: '',
    user: 'bg-$c-fg-30',
    assistant: 'bg-emerald-600/50 dark:bg-emerald-300 sm:(bg-gradient-to-br from-cyan-200 to-green-200)',
  }
  const [source] = createSignal('')
  const { copy, copied } = useClipboard({ source, copiedDuring: 1000 })

  useEventListener('click', (e) => {
    const el = e.target as HTMLElement
    let code = null

    if (el.matches('[data-code]')) {
      code = decodeURIComponent(el.dataset.code!)
      copy(code)
    }
    if (el.matches('[data-code] > div')) {
      code = decodeURIComponent(el.parentElement!.dataset.code!)
      copy(code)
    }
  })

  function heuristicPatch(markdown: string) {
    const pattern = /(^|\n)```\S*$/
    const matches = markdown.match(/```/g)

    return (matches && matches.length % 2 === 1 && pattern.test(markdown))
      ? markdown.replace(pattern, '\n```')
      : markdown
  }

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

      return `<div class="relative group">
        <div data-code=${encodeURIComponent(token.content)} class="gpt-copy-btn">
          ${copied() ? '<div mr-1 text-sm display-inline-block>Copied!</div><div i-mingcute-copy-2-fill></div>' : '<div i-mingcute-copy-2-line></div>'}
        </div>
        ${rawCode}
      </div>`
    }

    switch (typeof message) {
      case 'function':
        return md.render(heuristicPatch(message()))
      case 'string':
        return md.render(heuristicPatch(message))
      default:
        return ''
    }
  }

  return (
    <div class="px-2rem transition-colors -mx-2rem hover:bg-$c-fg-2 2xl:(px-2rem -mx-2rem) md:(px-5 transition-background-color -mx-5)">
      <div class="py-0.5 transition-padding 2xl:py-2 md:py-1">
        <div class="flex gap-3.5 rounded-lg" class:op-75={role === 'user'} class:reverse-self-msg={role === 'user' && alignRightMine}>
          <div class={`shrink-0 w-7 h-7 my-4 rounded-full op-80 ${roleClass[role]} <sm:w-1 <sm:h-auto <md:transition-background-color`} />
          <div class="relative max-w-full overflow-hidden break-words prose <sm:text-3.6 message" innerHTML={htmlString()} />
        </div>
        {showRetry?.() && onRetry && (
        <div class="mb-2 fie px-3">
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
