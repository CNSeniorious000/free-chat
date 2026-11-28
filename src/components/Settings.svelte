<script lang="ts">
  import { onMount } from 'svelte'

  import { isSiwcEnabled, isSiwcOrigin } from '@/utils/siwc'
  import { trackEvent } from '@/utils/track'

  import APIKeyInput from './controls/APIKeyInput.svelte'
  import BackgroundSelector from './controls/BackgroundSelector.svelte'
  import Group from './controls/Group.svelte'
  import Selector from './controls/ModelSelector.svelte'
  import Section from './controls/Section.svelte'
  import SiwcSettings from './controls/SiwcSettings.svelte'
  import Slider from './controls/Slider.svelte'
  import Toggle from './controls/Toggle.svelte'
  import Modal from './Modal.svelte'

  interface Props {
    show: boolean;
  }

  let { show = $bindable() }: Props = $props()

  let previousFocus = $state<HTMLElement | null>()
  let localSiwc = $state(false)
  let siwc = $state(false)

  onMount(() => {
    localSiwc = isSiwcOrigin()
    if (!localSiwc) return
    siwc = isSiwcEnabled()
    const url = new URL(window.location.href)
    if (url.searchParams.has('provider-settings')) {
      url.searchParams.delete('provider-settings')
      window.history.replaceState(null, '', url)
      show = true
    }
    if (siwc && url.searchParams.has('siwc')) show = true
  })

  function switchProvider(provider: string) {
    if (provider === 'siwc') localStorage.setItem('siwc:enabled', 'true')
    else localStorage.removeItem('siwc:enabled')
    // The chat island keeps one provider and one history for the lifetime of the page.
    const url = new URL(window.location.href)
    url.searchParams.set('provider-settings', '1')
    window.location.replace(url)
  }

  function handleKeydown({ altKey, code }: KeyboardEvent) {
    if (altKey && code === 'KeyO')
      show = !show
  }

  $effect(() => {
    if (show) {
      previousFocus = document.activeElement as HTMLElement | null
      trackEvent('open-settings')
    } else {
      previousFocus?.focus()
    }
  })
</script>

<svelte:window onkeydown={handleKeydown} />

<Modal bind:show icon="i-fluent-emoji-flat-eight-pointed-star">
  {#snippet inside()}
    <div class="i-fluent-thumb-like-24-filled text-lg"></div>
  {/snippet}
  <div class="w-full flex flex-col gap-5 -translate-y-3">
    <div class="hidden sm:inline">
      <Section title="背景图形">
        <BackgroundSelector />
      </Section>
    </div>

    <Section title="选择 LLM" tips="不同的模型响应速度也有区别，由供应商服务压力决定，可能会有波动">
      {#if localSiwc}
        <label class="flex items-center gap-2 text-sm">
          供应商
          <select class="min-w-0 flex-1 rounded bg-$c-fg-5 p-1.5" value={siwc ? 'siwc' : 'promplate'} onchange={event => switchProvider(event.currentTarget.value)}>
            <option value="promplate">Promplate（默认）</option>
            <option value="siwc">ChatGPT 订阅</option>
          </select>
        </label>
      {/if}
      {#if siwc}
        {#if show}<SiwcSettings />{/if}
      {:else}
        <Selector />
      {/if}
    </Section>

    {#if !siwc}
      <Section title="API 参数" tips="确保你了解你在修改什么">
        <Group title="API Key">
          <APIKeyInput />
        </Group>
        <Group title="Temperature">
          <Slider key="temperature" initial={undefined} />
        </Group>
      </Section>

      <Section title="偏好">
        <Group title="自动回复推荐">
          <Toggle key="suggestion" />
        </Group>
      </Section>
    {/if}
  </div>
</Modal>
