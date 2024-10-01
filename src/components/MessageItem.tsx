import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import remarkBreaks from 'remark-breaks'
import { SolidMarkdown } from 'solid-markdown'
import IconRefresh from './icons/Refresh'
import CodeBlock from './CodeBlock'
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

  function heuristicPatch(markdown: string) {
    const pattern = /(^|\n)```\S*$/
    const matches = markdown.match(/```/g)

    return (matches && matches.length % 2 === 1 && pattern.test(markdown))
      ? markdown.replace(pattern, '\n```')
      : markdown
  }

  return (
    <div class="px-20 transition-colors -mx-20 hover:bg-$c-fg-2 2xl:(px-20 -mx-20) md:(px-5 transition-background-color -mx-5)">
      <div class="py-0.5 transition-padding 2xl:py-2 md:py-1">
        <div class="flex gap-3.5 rounded-lg" class:op-75={role === 'user'} class:reverse-self-msg={role === 'user' && alignRightMine}>
          <div class={`shrink-0 w-7 h-7 my-4 rounded-full op-80 ${roleClass[role]} <sm:w-1 <sm:h-auto <md:transition-background-color`} />
          <SolidMarkdown
            renderingStrategy="reconcile"
            remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
            rehypePlugins={[rehypeHighlight, rehypeKatex]}
            class="relative max-w-full overflow-hidden break-words prose <sm:text-3.6 message"
            components={{
              code: CodeBlock,
              pre({ children }) {
                return <pre class="group overflow-hidden">{children}</pre>
              },
            }}
          >
            {heuristicPatch(typeof message === 'function' ? message() : message)}
          </SolidMarkdown>
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
