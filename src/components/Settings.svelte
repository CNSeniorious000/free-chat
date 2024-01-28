<script lang="ts">
  import Modal from './Modal.svelte'
  import Selector from './controls/ModelSelector.svelte'
  import APIKeyInput from './controls/APIKeyInput.svelte'
  import Toggle from './controls/Toggle.svelte'

  export let show: boolean
</script>

<Modal bind:show icon="i-fluent-emoji-flat-eight-pointed-star">
  <div class="i-fluent-thumb-like-24-filled text-lg" slot="inside"></div>
  <div class="w-full flex flex-col gap-2 -translate-y-3">
    <h3>选择 LLM</h3>
    <Selector />
    <p class="ml-0.5 mt-1 text-xs op-70">* 不同的模型响应速度也有区别，由供应商服务压力决定，可能会有波动</p>
    <h3 class="mt-5">使用自己的 OpenAI API Key</h3>
    <APIKeyInput />
    <p class="ml-0.5 mt-1 text-xs op-70">* 仅在选择 OpenAI 的模型时有效</p>
    <h3 class="mt-5">可选功能</h3>
    <div class="flex-rol flex justify-between text-sm">
      <div>自动回复推荐</div>
      <Toggle key="suggestion" />
    </div>
  </div>
</Modal>
