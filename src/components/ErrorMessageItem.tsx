import { createSignal, onMount } from 'solid-js'
import IconRefresh from './icons/Refresh'
import type { ErrorMessage } from '@/types'

interface Props {
  data: ErrorMessage
  onRetry?: () => void
}

export default ({ data, onRetry }: Props) => {
  const [title, setTitle] = createSignal(data.code)
  const [description, setDescription] = createSignal(data.message)

  onMount(() => {
    fetch('/api/translate', { method: 'POST', body: data.code }).then(res => res.text()).then(setTitle)
    fetch('/api/translate', { method: 'POST', body: data.message }).then(res => res.text()).then(setDescription)
  })

  return (
    <div class="border bg-red/10 border-red/50 my-4 py-3 px-4">
      {data.code && <div class="text-red mb-1">{title()}</div>}
      <div class="text-red text-sm op-70">{description()}</div>
      {onRetry && (
        <div class="mb-2 px-3 fie">
          <div onClick={onRetry} class="text-red ring-red/65 gpt-retry-btn <sm:ring-red/40 hover:bg-red/10">
            <IconRefresh />
            <span>重新生成</span>
          </div>
        </div>
      )}
    </div>
  )
}
