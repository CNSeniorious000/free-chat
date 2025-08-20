import { useChat } from '@/context/ChatContext'
import { trackEvent } from '@/utils/track'

export default () => {
  const { isStick, setStick, mounted } = useChat()

  return (
    <div class:op-30={!mounted()} class="fixed bottom-4.25 left-4.25 z-10 h-fit w-fit rounded-md transition sm:bottom-5 sm:left-5 active:scale-90 hover:bg-$c-fg-5" class:stick-btn-on={isStick()}>
      <button
        class="p-2.5 text-base"
        disabled={!mounted()}
        title="stick to bottom"
        type="button"
        onClick={() => {
          setStick(!isStick())
          trackEvent('stick-to-bottom', { stick: isStick() ? 'switch off' : 'switch on', trigger: 'mouse' })
        }}
      >
        <div i-ph-arrow-line-down-bold />
      </button>
    </div>
  )
}
