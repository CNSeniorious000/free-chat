import { createSignal, onMount } from 'solid-js'
import { fetchTranslation } from '@/utils/misc'
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
    fetchTranslation(data.code).then(setTitle)
    fetchTranslation(data.message).then(setDescription)
  })

  return (
    <div class="my-4 border border-red/50 bg-red/10 px-4 py-3">
      {data.code && <div class="mb-1 text-red">{title()}</div>}
      <div class="text-sm text-red op-70">{description()}</div>
      {onRetry && (
        <div class="mb-2 fie px-3">
          <div onClick={onRetry} class="text-red ring-red/65 gpt-retry-btn hover:bg-red/10 <sm:ring-red/40">
            <IconRefresh />
            <span>重新生成</span>
          </div>
        </div>
      )}
    </div>
  )
}
