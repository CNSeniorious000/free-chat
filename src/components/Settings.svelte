<script lang="ts">
  import Modal from './Modal.svelte'
  import Selector from './controls/ModelSelector.svelte'
  import APIKeyInput from './controls/APIKeyInput.svelte'
  import Toggle from './controls/Toggle.svelte'
  import Slider from './controls/Slider.svelte'
  import Group from './controls/Group.svelte'
  import Section from './controls/Section.svelte'

  export let show: boolean
</script>

<Modal bind:show icon="i-fluent-emoji-flat-eight-pointed-star">
  <div class="i-fluent-thumb-like-24-filled text-lg" slot="inside"></div>
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
