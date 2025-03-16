import { createMemo, Index, Show } from 'solid-js'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkBreaks from 'remark-breaks'
import { PUBLIC_RIGHT_ALIGN_MY_MSG } from 'astro:env/client'
import { SolidMarkdown } from 'solid-markdown'
import IconRefresh from './icons/Refresh'
import CodeBlock from './CodeBlock'
import type { Accessor } from 'solid-js'
import type { ChatMessage } from '@/types'
import { splitReasoningPart } from '@/utils/deepseek'

interface Props {
  role: ChatMessage['role']
  message: Accessor<string> | string
  showRetry?: Accessor<boolean>
  onRetry?: () => void
}

const alignRightMine = PUBLIC_RIGHT_ALIGN_MY_MSG

export default ({ role, message, showRetry, onRetry }: Props) => {
  const roleClass = {
    system: '',
    user: 'bg-$c-fg-30',
    assistant: 'bg-emerald-600/50 dark:bg-emerald-300 sm:(bg-gradient-to-br from-cyan-200 to-green-200)',
  }

  const result = createMemo(() => splitReasoningPart(typeof message === 'function' ? message() : message))
  const reasoningContent = () => result()[0]
  const content = () => result()[1]

  function heuristicPatch(markdown: string) {
    const pattern = /(^|\n)```\S*$/
    const matches = markdown.match(/```/g)

    return (matches && matches.length % 2 === 1 && pattern.test(markdown))
      ? markdown.replace(pattern, '\n```')
      : markdown
  }

  return (
    <div class="px-2rem transition-colors -mx-2rem hover:bg-$c-fg-2 2xl:(px-2rem -mx-2rem) md:(px-5 transition-background-color -mx-5)">
      <div class="py-0.5 transition-padding 2xl:py-2 md:py-1">
        <div class="flex gap-3.5 rounded-lg" class:op-75={role === 'user'} class:reverse-self-msg={role === 'user' && alignRightMine}>
          <div class={`shrink-0 w-7 h-7 my-4 rounded-full op-80 ${roleClass[role]} <sm:w-1 <sm:h-auto <md:transition-background-color`} />
          <div class="break-words message">
            <Show when={reasoningContent()}>
              <div class="mt-1em flex flex-col gap-1.3 ws-pre-wrap rounded bg-$c-fg-2 px-2.5 py-2 text-(0.8em $c-fg-70) ring-(1 $c-fg-5 inset)">
                <Index each={reasoningContent().split('\n\n')}>
                  {line => (
                    <div class="px-2.5 py-0.7 -mx-2.5 -my-0.7 hover:(bg-$c-fg-10)">{line()}</div>
                  )}
                </Index>
              </div>
            </Show>
            <SolidMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              class="relative max-w-full overflow-hidden prose <sm:text-3.6 message"
              components={{
                code: CodeBlock,
                pre({ children }) {
                  return <pre class="group overflow-hidden">{children}</pre>
                },
              }}
            >
              {heuristicPatch(content())}
            </SolidMarkdown>
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
