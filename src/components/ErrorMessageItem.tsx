import IconRefresh from './icons/Refresh'
import type { ErrorMessage } from '@/types'

interface Props {
  data: ErrorMessage
  onRetry?: () => void
}

export default ({ data, onRetry }: Props) => {
  return (
    <div class="border bg-red/10 border-red/50 my-4 py-3 px-4">
      {data.code && <div class="text-red mb-1">{data.code}</div>}
      <div class="text-red text-sm op-70">{data.message}</div>
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
