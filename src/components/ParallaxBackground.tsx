import { createSpring } from '@solid-primitives/spring'
import { createEffect, createSignal, onMount } from 'solid-js'

import { useChat } from '@/context/ChatContext'

export default () => {
  const { isStick, streaming, messageList, currentError } = useChat()

  let bgd!: HTMLDivElement
  const [bgdAnimating, setBgdAnimating] = createSignal(false)

  onMount(() => {
    const damping = 0.5
    const stiffness = (damping ** 2) / 4.1
    const [bgdOffset, setBgdOffset] = createSpring(0, { stiffness, damping })
    const [bgdOffsetTarget, setBgdOffsetTarget] = createSignal(-document.documentElement.scrollTop / 10)

    function applyBgdOffset(value: number) {
      bgd.style.setProperty('--scroll', `${value}pt`)
    }

    // Update target on scroll
    window.addEventListener('scroll', () => {
      setBgdOffsetTarget(-document.documentElement.scrollTop / 10)
    })

    // Update target on resize
    window.addEventListener('resize', () => {
      setBgdOffsetTarget(-document.documentElement.scrollTop / 10)
    })

    // Animate when streaming
    createEffect(() => {
      if (streaming()) {
        isStick() // Track the signal change
        setBgdAnimating(true)
      }
    })

    // Animate when new user message is added
    createEffect(() => {
      if (messageList().at(-1)?.role === 'user') {
        setBgdAnimating(true)
      }
    })

    // Animate when error occurs in stick-to-bottom mode
    createEffect(() => {
      if (currentError() && isStick()) {
        setBgdAnimating(true)
      }
    })

    // Stop animating when spring reaches target
    createEffect(() => {
      const reached = Math.round(bgdOffset()) === Math.round(bgdOffsetTarget())
      if (reached && !(isStick() && streaming())) setBgdAnimating(false)
    })

    // Apply offset
    createEffect(() => {
      applyBgdOffset(bgdAnimating() ? bgdOffset() : bgdOffsetTarget())
    })

    // Drive spring
    createEffect(() => {
      setBgdOffset(bgdOffsetTarget(), { hard: !bgdAnimating() })
    })

    // Listen for Alt+C clear event
    window.addEventListener('keydown', (event) => {
      if (event.altKey && event.code === 'KeyC') {
        setBgdAnimating(true)
      }
    }, false)
  })

  return (
    <div
      ref={bgd}
      class="fixed left-0 top-0 z--1 h-1000vh w-full translate-y-$scroll animate-fade-in bg-top-center bg-hero-jigsaw-gray-500/10 <md:bg-none <md:hidden"
    />
  )
}
