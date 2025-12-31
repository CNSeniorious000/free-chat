import { useKeyDownList } from '@solid-primitives/keyboard'

interface HotKeyProps {
  key: string
  text?: string
}

export const HotKey = (props: HotKeyProps) => {
  const pressedKeys = useKeyDownList()
  const isPressed = () => pressedKeys().includes(props.key)

  return (
    <span class="rounded-md bg-$c-fg-5 px-1.75 py-1 font-mono ring-1.2 ring-$c-fg-20 transition duration-150" classList={{ 'text-$c-bg !bg-$c-fg !ring-$c-fg !duration-0': isPressed() }}>
      {props.text ?? props.key}
    </span>
  )
}
