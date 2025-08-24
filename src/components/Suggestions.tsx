import { Index, Show } from 'solid-js'

import { useChat } from '@/context/ChatContext'
import { trackEvent } from '@/utils/track'

export default () => {
  const { suggestionFeatureOn, streaming, inview, suggestions, setInputValue, inputRef, md } = useChat()

  return (
    <Show when={suggestionFeatureOn() && !streaming()}>
      <div classList={{ 'op-0 pointer-events-none': !inview() }} class="relative z-1 translate-y-1.5 px-2rem transition-opacity -mx-2rem">
        <div class="mt-1 flex flex-row gap-2 overflow-x-scroll ws-nowrap px-2rem scrollbar-none -mx-2rem [&>button]:(rounded bg-$c-fg-5 px-1 py-1 text-start text-xs text-$c-fg-90 outline-none ring-$c-fg-50 transition-background-color)">
          <Show when={suggestions().length} fallback={<button disabled role="presentation" class="invisible">&nbsp;</button>}>
            <Index each={suggestions()}>
              {(item, index) => <button type="button" onClick={() => { setInputValue(item()); const el = inputRef(); el?.focus(); trackEvent('accept-suggestion', { index }) }} class="animate-(fade-in duration-200) hover:bg-$c-fg-10 focus-visible:ring-1.3" innerHTML={md().renderInline(item())}></button>}
            </Index>
          </Show>
        </div>
        <div class="pointer-events-none absolute inset-0 w-full flex flex-row justify-between" role="presentation">
          <div class="w-2rem bg-gradient-(from-$c-bg to-op-0 to-r) <md:transition-all" style={{ '--un-gradient-shape': 'to right' }} />
          <div class="w-2rem bg-gradient-(from-$c-bg to-op-0 to-l) <md:transition-all" style={{ '--un-gradient-shape': 'to left' }} />
        </div>
      </div>
    </Show>
  )
}
