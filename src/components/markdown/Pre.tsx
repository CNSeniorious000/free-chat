import type { Code } from 'mdast'

import { writeClipboard } from '@solid-primitives/clipboard'
import { debounce } from '@solid-primitives/scheduled'
import hljs from 'highlight.js'
import { createMemo, createSignal, Show } from 'solid-js'

const availableLanguages = hljs.listLanguages()

export default function Pre(props: { node: Code }) {
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
  const [copied, setCopied] = createSignal(false)

  // Use debounce to reset copied state after 1000ms
  const debouncedResetCopied = debounce(() => setCopied(false), 1000)

  const html = createMemo(() => {
    const { value: source, lang: language } = props.node

    if (language && availableLanguages.includes(language)) {
      return hljs.highlight(source, { language }).value
    } else {
      return hljs.highlightAuto(source).value
    }
  })

  let codeContainer!: HTMLDivElement

  return (
    <pre class="group overflow-hidden">
      <code class="group hljs block w-full overflow-x-scroll !px-20px !py-18px">
        <Show when={props.node.value && props.node.value.trim().length > 0}>
          <button onClick={() => copy()} class="gpt-copy-btn gap-1 text-sm">
            {copied() && <div class="text-sm font-sans">Copied!</div>}
            <div class={copied() ? 'i-mingcute-copy-2-fill' : 'i-mingcute-copy-2-line'} />
          </button>
          <div ref={codeContainer} class="contents" innerHTML={html()} />
        </Show>
      </code>
    </pre>
  )
}
