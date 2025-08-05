import { render } from 'katex'
import { createEffect, createSignal } from 'solid-js'

export default function LaTeX(props: { value: string, inline: boolean }) {
  const [ref, setRef] = createSignal<HTMLDivElement>()
  createEffect(() => {
    ref() && render(props.value, ref()!, { throwOnError: false, displayMode: !props.inline, trust: true })
  })
  return <div ref={setRef} class={props.inline ? 'contents' : 'w-full text-center'} />
}
