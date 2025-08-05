import { createEffect, createSignal, Index, untrack } from 'solid-js'

export default function Text(props: { text: string }) {
  const [parts, setParts] = createSignal<string[]>([])

  createEffect(() => {
    const last = untrack(parts)
    const previous = last.join('')

    if (props.text === previous) {
      return
    }
    if (props.text.startsWith(previous)) {
      setParts([...last, props.text.slice(previous.length)])
    } else {
      let index = last.length - 1
      while (index >= 0 && !props.text.startsWith(last.slice(0, index + 1).join(''))) {
        index--
      }
      setParts([...last.slice(0, index + 1), props.text.slice(last.slice(0, index + 1).join('').length)])
    }
  })

  return (
    <Index each={parts()}>
      {
        // part => <span class="animate-(fade-in duration-1000 ease-out)">{part()}</span>
        part => <span>{part()}</span>
      }
    </Index>
  )
};
