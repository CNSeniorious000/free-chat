import type { ErrorMessage } from '@/types'

import IconRefresh from './icons/Refresh'

interface Props {
  data: ErrorMessage
  onRetry?: () => void
}

export default ({ data, onRetry }: Props) => {
  return (
    <div class="my-4 border border-red/50 bg-red/10 px-4 py-3">
      {data.code && <div class="mb-1 text-red">{data.code}</div>}
      <div class="text-sm text-red op-70">{data.message}</div>
      {data.code === 'subscription_sharing_usage_limit_exceeded' && (
        <a class="text-sm underline" href="https://chatgpt.com/settings/usage" target="_blank" rel="noreferrer">管理 ChatGPT 用量</a>
      )}
      {onRetry && (
        <div class="mb-2 fie px-3">
          <div onClick={onRetry} class="gpt-retry-btn text-red ring-red/65 hover:bg-red/10 <sm:ring-red/40">
            <IconRefresh />
            <span>重新生成</span>
          </div>
        </div>
      )}
    </div>
  )
}
