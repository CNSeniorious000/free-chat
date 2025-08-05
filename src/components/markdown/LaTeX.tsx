import { render } from 'katex'
import { createEffect, createSignal } from 'solid-js'

export default function LaTeX(props: { value: string, inline: boolean }) {
  const [ref, setRef] = createSignal<HTMLDivElement>()
  createEffect(() => {
    ref() && render(props.value, ref()!, { throwOnError: false, displayMode: !props.inline })
  })
  return <div ref={setRef} />
}
