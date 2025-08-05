import type { KatexOptions } from 'katex'

import { createEffect, createSignal } from 'solid-js'

export default function LaTeX(props: { value: string, inline: boolean }) {
  async function render(value: string, element: HTMLElement, options?: KatexOptions) {
    const { render } = await import('katex')
    render(value, element, options)
  }
  const [ref, setRef] = createSignal<HTMLDivElement>()
  createEffect(() => {
    ref() && render(props.value, ref()!, { throwOnError: false, displayMode: !props.inline, trust: true })
  })
  return <div ref={setRef} class={props.inline ? 'contents' : 'w-full text-center'} />
}
