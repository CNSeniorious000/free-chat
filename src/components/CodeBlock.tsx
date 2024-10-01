import { useClipboard } from 'solidjs-use'
import type { SolidMarkdownComponents } from 'solid-markdown'

const CodeBlock: SolidMarkdownComponents['code'] = ({ children, inline }) => {
  if (inline)
    return <code>{children}</code>

  const source = String(children)

  const { copy, copied } = useClipboard({ copiedDuring: 1000 })

  return (
    <code class="group hljs block w-full overflow-x-scroll px-20px py-18px">
      <button onClick={() => copy(source)} class="gap-1 text-sm gpt-copy-btn">
        {copied() && <div class="text-sm font-sans">Copied!</div>}
        <div class={copied() ? 'i-mingcute-copy-2-fill' : 'i-mingcute-copy-2-line'} />
      </button>
      {children}
    </code>
  )
}

export default CodeBlock
