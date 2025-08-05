import type { Accessor } from 'solid-js'

import { PUBLIC_RIGHT_ALIGN_MY_MSG } from 'astro:env/client'
import { createMemo, Index, Show } from 'solid-js'

import type { ChatMessage } from '@/types'

import { splitReasoningPart } from '@/utils/deepseek'

import CodeBlock from './CodeBlock'
import IconRefresh from './icons/Refresh'
import { EnhancedMarkdown } from './markdown'

interface Props {
  role: ChatMessage['role']
  message: Accessor<string> | string
  incomplete?: boolean
  showRetry?: Accessor<boolean>
  onRetry?: () => void
}

const alignRightMine = PUBLIC_RIGHT_ALIGN_MY_MSG

export default ({ role, message, showRetry, onRetry, incomplete = false }: Props) => {
  const roleClass = {
    system: '',
    user: 'bg-$c-fg-30',
    assistant: 'bg-emerald-600/50 dark:bg-emerald-300 sm:(bg-gradient-to-br from-cyan-200 to-green-200)',
  }

  const result = createMemo(() => splitReasoningPart(typeof message === 'function' ? message() : message))
  const reasoningContent = () => result()[0]
  const content = createMemo(() => incomplete ? heuristicPatch(result()[1]) : result()[1])

  function heuristicPatch(markdown: string) {
    const lastNewlineIndex = markdown.lastIndexOf('\n')
    let rest: string, lastLine: string
    if (lastNewlineIndex === -1) {
      rest = ''
      lastLine = markdown
    } else {
      rest = markdown.slice(0, lastNewlineIndex)
      lastLine = markdown.slice(lastNewlineIndex + 1)
    }
    if (!lastLine.trim() || (lastLine.trimStart().startsWith('``') && lastLine.trimStart().length < 20) || /^([*+-])\1*$/.test(lastLine.trim())) {
      return rest
    } else if ((lastLine.match(/`/g)?.length || 0) % 2 !== 0 && !lastLine.includes('\\`')) {
      return lastLine.endsWith('`') ? `${rest}\n${lastLine.slice(0, -1)}` : `${rest}\n${lastLine}\``
    } else if ((lastLine.replace(/`[^`]*`/g, '').match(/\*\*/g)?.length || 0) % 2 !== 0 && !lastLine.includes('\\*')) {
      if (lastLine.endsWith('**'))
        return `${rest}\n${lastLine.slice(0, -2)}`
      else
        return `${rest}\n${lastLine}${'*'.repeat(2 - Number(lastLine.endsWith('*')))}`
    } else if ((lastLine.match(/\*/g)?.length || 0) % 2 !== 0 && lastLine.endsWith('*') && !lastLine.includes('\\*')) {
      return `${rest}\n${lastLine.slice(0, -1)}`
    } else {
      return `${rest}\n${lastLine}`
    }
  }

  return (
    <div class="px-2rem transition-colors -mx-2rem hover:bg-$c-fg-2 2xl:(px-2rem -mx-2rem) md:(px-5 transition-background-color -mx-5)">
      <div class="py-0.5 transition-padding 2xl:py-2 md:py-1">
        <div class="flex gap-3.5 rounded-lg" class:op-75={role === 'user'} class:reverse-self-msg={role === 'user' && alignRightMine}>
          <div class={`my-4 h-7 w-7 shrink-0 rounded-full op-80 ${roleClass[role]} <sm:(h-auto w-1) <md:transition-background-color`} />
          <div class="message break-words">
            <Show when={reasoningContent()}>
              <div class="mt-1em flex flex-col gap-1.3 ws-pre-wrap rounded bg-$c-fg-2 px-2.5 py-2 text-(0.8em $c-fg-70) ring-(1 $c-fg-5 inset)">
                <Index each={reasoningContent().split('\n\n')}>
                  {line => (
                    <div class="px-2.5 py-0.7 -mx-2.5 -my-0.7 hover:(bg-$c-fg-10)">{line()}</div>
                  )}
                </Index>
              </div>
            </Show>
            <EnhancedMarkdown
              text={content()}
              OverrideCode={CodeBlock}
              class="message relative max-w-full overflow-hidden prose <sm:text-3.6"
            />
          </div>
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
