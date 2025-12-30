<script lang="ts">
  import { trackEvent } from '@/utils/track'

  import APIKeyInput from './controls/APIKeyInput.svelte'
  import Group from './controls/Group.svelte'
  import Selector from './controls/ModelSelector.svelte'
  import Section from './controls/Section.svelte'
  import Slider from './controls/Slider.svelte'
  import Toggle from './controls/Toggle.svelte'
  import Modal from './Modal.svelte'

  interface Props {
    show: boolean;
  }

  let { show = $bindable() }: Props = $props()

  let previousFocus = $state<HTMLElement | null>()

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
    <Section title="选择 LLM" tips="不同的模型响应速度也有区别，由供应商服务压力决定，可能会有波动">
      <Selector />
    </Section>

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
  </div>
</Modal>
