import { createSpring } from '@solid-primitives/spring'
import { batch, createEffect, createMemo, createSignal } from 'solid-js'

interface CreateSmoothStreamingParams {
  onDone: (content: string) => void
  damping?: number
}

export function createSmoothStreaming({ onDone, damping = 0.25 }: CreateSmoothStreamingParams) {
  const [realValue, setRealValue] = createSignal('')
  const [done, setDone] = createSignal(true)
  const [currentAssistantMessage, setCurrentAssistantMessage] = createSignal('')

  const stiffness = (damping ** 2) / 4.1
  const [_displayedLength, setDisplayedLength] = createSpring(0, { stiffness, damping, precision: 0.001 })
  const displayedLength = createMemo(() => Math.round(_displayedLength()))

  createEffect(() => {
    const length = displayedLength()
    setCurrentAssistantMessage(realValue().slice(0, length))

    if (done() && length >= realValue().length) {
      if (currentAssistantMessage()) {
        onDone(currentAssistantMessage())
      }
      // Reset internal state after archiving
      batch(() => {
        setCurrentAssistantMessage('')
        setDisplayedLength(0, { hard: true })
        setRealValue('')
      })
    }
  })

  const start = () => {
    batch(() => {
      setCurrentAssistantMessage('')
      setRealValue('')
      setDone(false)
      setDisplayedLength(0, { hard: true })
    })
  }

  const append = (delta: string) => {
    setRealValue((prev) => {
      const next = prev + delta
      if (delta.trim())
        setDisplayedLength(next.length)

      return next
    })
  }

  const finish = () => {
    batch(() => {
      setDisplayedLength(realValue().length + 7)
      setDone(true)
    })
  }

  const clear = () => {
    batch(() => {
      setCurrentAssistantMessage('')
      setDisplayedLength(0, { hard: true })
      setRealValue('')
      setDone(true)
    })
  }

  return {
    currentAssistantMessage,
    start,
    append,
    finish,
    clear,
  }
}
