import { type Setter, onCleanup, onMount } from 'solid-js'

export default (props: {
  setInview: Setter<boolean>
  class: string
}) => {
  let div: HTMLDivElement | undefined

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        props.setInview(entry.isIntersecting)
      }, {
        threshold: 0,
      },
    )

    observer.observe(div!)

    onCleanup(() => {
      observer.disconnect()
    })
  })

  return <div ref={div} class={props.class} role="presentation" />
}
