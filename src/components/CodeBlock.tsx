import type { SolidMarkdownComponents } from 'solid-markdown'

import { writeClipboard } from '@solid-primitives/clipboard'
import { debounce } from '@solid-primitives/scheduled'
import hljs from 'highlight.js'
import { createMemo, createSignal, Show } from 'solid-js'

const availableLanguages = hljs.listLanguages()

const CodeBlock: SolidMarkdownComponents['code'] = (props) => {
  const { children, inline } = props
  if (inline)
    return <code>{children}</code>

  const [lang, setLang] = createSignal<string>()
  const [copied, setCopied] = createSignal(false)

  // Use debounce to reset copied state after 1000ms
  const debouncedResetCopied = debounce(() => setCopied(false), 1000)

  const copy = async() => {
    setCopied(true)

    try {
      await writeClipboard([
        new ClipboardItem({ 'text/plain': codeContainer.textContent!, 'text/html': codeContainer.outerHTML }),
      ])
    } catch {
      writeClipboard(codeContainer.textContent!)
    }

    debouncedResetCopied()
  }

  const code = createMemo<string>(() => {
    setLang(props.class?.replace(/^language-/, ''))
    // @ts-expect-error `children` is a function
    return children()[0]()()
  })

  let codeContainer!: HTMLDivElement

  return (
    <code class="group hljs block w-full overflow-x-scroll !px-20px !py-18px">
      <Show when={code()}>
        <button onClick={() => copy()} class="gpt-copy-btn gap-1 text-sm">
          {copied() && <div class="pointer-events-none text-sm font-sans">Copied!</div>}
          <div class={copied() ? 'i-mingcute-copy-2-fill pointer-events-none' : 'i-mingcute-copy-2-line pointer-events-none'} />
        </button>
        <div ref={codeContainer} class="contents" innerHTML={lang() && availableLanguages.includes(lang()!) ? hljs.highlight(code(), { language: lang()! }).value : hljs.highlightAuto(code()).value} />
      </Show>
    </code>
  )
}

export default CodeBlock
