import { createSpring } from '@solid-primitives/spring'
import { batch, createEffect, createMemo, createSignal, untrack } from 'solid-js'

interface CreateSmoothStreamingParams {
  onDone: (content: string) => void
  damping?: number
}

export function createSmoothStreaming({ onDone, damping = 0.25 }: CreateSmoothStreamingParams) {
  let bufferedValue = ''
  const [realValue, setRealValue] = createSignal('')
  const [done, setDone] = createSignal(false)
  const [currentAssistantMessage, setCurrentAssistantMessage] = createSignal('')

  const stiffness = (damping ** 2) / 4.1
  const [_displayedLength, setDisplayedLength] = createSpring(0, { stiffness, damping, precision: 0.001 })
  const displayedLength = createMemo(() => Math.round(_displayedLength()))

  const reset = () => {
    bufferedValue = ''
    setDone(false)
    setCurrentAssistantMessage('')
    setDisplayedLength(0, { hard: true })
    setRealValue('')
  }

  createEffect(() => {
    const length = displayedLength()
    const fullMessage = realValue()
    setCurrentAssistantMessage(fullMessage.slice(0, length))

    if (done() && length >= fullMessage.length) {
      batch(() => {
        reset()
        untrack(() => onDone(fullMessage))
      })
    }
  })

  const append = (delta: string) => {
    bufferedValue += delta
    if (delta.trim())
      setDisplayedLength(bufferedValue.length)
    setRealValue(bufferedValue)
  }

  const finish = (immediate = false) => {
    batch(() => {
      setDisplayedLength(bufferedValue.length + 7, { hard: immediate })
      setDone(true)
    })
  }

  const clear = () => batch(reset)

  return {
    currentAssistantMessage,
    start: clear,
    append,
    finish,
    clear,
  }
}
