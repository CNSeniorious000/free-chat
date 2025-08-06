import type { Code } from 'mdast'

import hljs from 'highlight.js'
import { createMemo, Show } from 'solid-js'
import { useClipboard } from 'solidjs-use'

const availableLanguages = hljs.listLanguages()

export default function Pre(props: { node: Code }) {
  const { copy, copied } = useClipboard({ copiedDuring: 1000 })

  const html = createMemo(() => {
    const { value: source, lang: language } = props.node

    if (language && availableLanguages.includes(language)) {
      return hljs.highlight(source, { language }).value
    } else {
      return hljs.highlightAuto(source).value
    }
  })

  return (
    <pre class="group overflow-hidden">
      <code class="group hljs block w-full overflow-x-scroll !px-20px !py-18px">
        <Show when={props.node.value && props.node.value.trim().length > 0}>
          <button onClick={() => copy(props.node.value)} class="gpt-copy-btn gap-1 text-sm">
            {copied() && <div class="text-sm font-sans">Copied!</div>}
            <div class={copied() ? 'i-mingcute-copy-2-fill' : 'i-mingcute-copy-2-line'} />
          </button>
          <div class="contents" innerHTML={html()} />
        </Show>
      </code>
    </pre>
  )
}
