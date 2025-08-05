import hljs from 'highlight.js'
import { createMemo, createSignal, Show } from 'solid-js'
import { useClipboard } from 'solidjs-use'

import type { SolidMarkdownComponents } from '../solid-markdown'

const availableLanguages = hljs.listLanguages()

const CodeBlock: SolidMarkdownComponents['code'] = (props) => {
  const { children, inline } = props
  if (inline)
    return <code>{children}</code>

  const [lang, setLang] = createSignal<string>()

  const { copy, copied } = useClipboard({ copiedDuring: 1000 })

  const code = createMemo<string>(() => {
    setLang(props.class?.replace(/^language-/, ''))
    // @ts-expect-error `children` is a function
    return children()[0]()()
  })

  return (
    <code class="group hljs block w-full overflow-x-scroll !px-20px !py-18px">
      <Show when={code()}>
        <button onClick={() => copy(code())} class="gpt-copy-btn gap-1 text-sm">
          {copied() && <div class="text-sm font-sans">Copied!</div>}
          <div class={copied() ? 'i-mingcute-copy-2-fill' : 'i-mingcute-copy-2-line'} />
        </button>
        <div class="contents" innerHTML={lang() && availableLanguages.includes(lang()!) ? hljs.highlight(code(), { language: lang()! }).value : hljs.highlightAuto(code()).value} />
      </Show>
    </code>
  )
}

export default CodeBlock
