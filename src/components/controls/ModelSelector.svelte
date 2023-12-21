<script lang="ts">
  import { onMount } from 'svelte'

  type Model = 'gpt-3.5-turbo-0301' | 'gpt-3.5-turbo-0613' | 'gpt-3.5-turbo-1106' | 'chatglm_turbo';
  let model: Model

  onMount(() => (model = (localStorage.getItem('model') as Model) || 'gpt-3.5-turbo-1106'))
  $: typeof localStorage !== 'undefined' && model && localStorage.setItem('model', model)
</script>

<div class="grid grid-cols-2 w-full justify-between gap-1.5 rounded-md bg-$c-fg-2 p-1.5 text-sm">
  <input type="radio" name="model" id="1106" hidden on:click={() => (model = 'gpt-3.5-turbo-1106')} checked={model === 'gpt-3.5-turbo-1106'} />
  <label for="1106">
    <h4>gpt-3.5-turbo-1106</h4>
    <h5>最新，偶尔会无缘无故拒绝回答</h5>
  </label>
  <input type="radio" name="model" id="0613" hidden on:click={() => (model = 'gpt-3.5-turbo-0613')} checked={model === 'gpt-3.5-turbo-0613'} />
  <label for="0613">
    <h4>gpt-3.5-turbo-0613</h4>
    <h5>次新</h5>
  </label>
  <input type="radio" name="model" id="0301" hidden on:click={() => (model = 'gpt-3.5-turbo-0301')} checked={model === 'gpt-3.5-turbo-0301'} />
  <label for="0301">
    <h4>gpt-3.5-turbo-0301</h4>
    <h5>最旧，最高只支持 4K 上下文</h5>
  </label>
  <input type="radio" name="model" id="glm" hidden on:click={() => (model = 'chatglm_turbo')} checked={model === 'chatglm_turbo'} />
  <label for="glm">
    <h4 class="rounded-sm text-xs tracking-widest font-mono uppercase">chatglm-turbo</h4>
    <h5 class="text-3.1 line-height-1.4em -translate-y-0.5">由智谱 AI 提供服务</h5>
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
