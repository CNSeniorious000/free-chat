<script lang="ts">
  import { onMount } from 'svelte'
  import { trackEvent } from '@/utils/track'

  type Model = 'gpt-3.5-turbo-0301' | 'gpt-3.5-turbo-0613' | 'gpt-3.5-turbo-1106' | 'gpt-4-0125-preview' | 'chatglm_turbo' | 'claude-instant-1.2' | 'claude-2.1' | 'mixtral-8x7b-instruct-fp16';
  let model: Model

  onMount(() => (model = (localStorage.getItem('model') || (import.meta.env.PUBLIC_DEFAULT_MODEL ?? 'gpt-3.5-turbo-1106')) as Model))
  $: typeof localStorage !== 'undefined' && model && localStorage.setItem('model', model)

  function setModel(newModel: Model) {
    model = newModel
    trackEvent('model', { model })
  }
</script>

<div class="grid grid-cols-2 w-full justify-between gap-1.5 rounded-md bg-$c-fg-2 p-1.5 text-sm">
  <input type="radio" name="model" id="1106" hidden on:click={() => setModel('gpt-3.5-turbo-1106')} checked={model === 'gpt-3.5-turbo-1106'} />
  <label for="1106">
    <h4>gpt-3.5-turbo-1106</h4>
    <h5>最新，偶尔会无缘无故拒绝回答</h5>
  </label>
  <input type="radio" name="model" id="0613" hidden on:click={() => setModel('gpt-3.5-turbo-0613')} checked={model === 'gpt-3.5-turbo-0613'} />
  <label for="0613">
    <h4>gpt-3.5-turbo-0613</h4>
    <h5>次新</h5>
  </label>
  <input type="radio" name="model" id="0301" hidden on:click={() => setModel('gpt-3.5-turbo-0301')} checked={model === 'gpt-3.5-turbo-0301'} />
  <label for="0301">
    <h4>gpt-3.5-turbo-0301</h4>
    <h5>最旧，最高只支持 4K 上下文</h5>
  </label>
  <input type="radio" name="model" id="gpt4" hidden on:click={() => setModel('gpt-4-0125-preview')} checked={model === 'gpt-4-0125-preview'} />
  <label for="gpt4">
    <h4>gpt-4-0125-preview</h4>
    <h5>填写自己的 API Key 以使用</h5>
  </label>
  <input type="radio" name="model" id="moe" hidden on:click={() => setModel('mixtral-8x7b-instruct-fp16')} checked={model === 'mixtral-8x7b-instruct-fp16'} />
  <label for="moe">
    <h4>mixtral-8x7b-instruct-fp16</h4>
    <h5>时下最火的 MOE 模型，最快</h5>
  </label>
  <input type="radio" name="model" id="glm" hidden on:click={() => setModel('chatglm_turbo')} checked={model === 'chatglm_turbo'} />
  <label for="glm">
    <h4 class="rounded-sm text-xs tracking-widest font-mono uppercase">chatglm-turbo</h4>
    <h5 class="text-3.1 line-height-1.4em -translate-y-0.5">不支持自定义场景</h5>
  </label>
  <input type="radio" name="model" id="claude-1.2" disabled hidden on:click={() => setModel('claude-instant-1.2')} checked={model === 'claude-instant-1.2'} />
  <label for="claude-1.2">
    <h4>claude-instant-1.2</h4>
    <h5>最快，但不支持自定义场景</h5>
  </label>
  <input type="radio" name="model" id="claude-2.1" disabled hidden on:click={() => setModel('claude-2.1')} checked={model === 'claude-2.1'} />
  <label for="claude-2.1">
    <h4>claude-2.1</h4>
    <h5>支持 200K 输入，限时免费</h5>
  </label>
</div>

<style>
  h4 {
    --uno: rounded-sm text-xs tracking-widest font-mono uppercase op-50;
  }

  h5 {
    --uno: text-3.1 line-height-1.4em -translate-y-0.5;
  }

  input:disabled ~ label {
    --uno: op-15;
  }

  label {
    --uno: w-full flex flex-col gap-0.5 rounded p-1.5 ring-$c-fg ring-inset transition-all duration-100 ease-out active:scale-97 bg-$c-fg-5 hover:bg-$c-fg-15 hover:ring-1.2 [:checked+&]:(\!bg-$c-fg text-$c-bg hover:op-80);
  }
</style>
