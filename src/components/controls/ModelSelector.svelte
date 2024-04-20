<script lang="ts">
  import { onMount } from 'svelte'
  import { trackEvent } from '@/utils/track'

  type Model = 'gpt-3.5-turbo-0125' | 'gpt-4o-2024-05-13' | 'gpt-4-0125-preview' | 'gpt-4-turbo-2024-04-09' | 'qwen-turbo' | 'claude-3-haiku-20240307' | 'mixtral-8x7b-32768' | 'gemma-7b-it' | 'nous-hermes-2-mixtral-8x7b-dpo' | 'llama3-8b-8192' | 'llama3-70b-8192';
  let model: Model

  onMount(() => (model = (localStorage.getItem('model') || (import.meta.env.PUBLIC_DEFAULT_MODEL ?? 'gpt-3.5-turbo-0125')) as Model))
  $: typeof localStorage !== 'undefined' && model && localStorage.setItem('model', model)

  function setModel(newModel: Model) {
    model = newModel
    trackEvent('model', { model })
  }
</script>

<div class="grid grid-cols-2 w-full justify-between gap-1.5 rounded-md bg-$c-fg-2 p-1.5 text-sm">
  <input type="radio" name="model" id="mixtral" hidden on:click={() => setModel('mixtral-8x7b-32768')} checked={model === 'mixtral-8x7b-32768'} />
  <label for="mixtral">
    <h4>mixtral-8x7b</h4>
    <h5>来自法国的明星大模型 Mixtral 🚀</h5>
  </label>
  <input type="radio" name="model" id="gemma" hidden on:click={() => setModel('gemma-7b-it')} checked={model === 'gemma-7b-it'} />
  <label for="gemma">
    <h4>gemma-7b-it</h4>
    <h5>Google 的开源大模型 Gemma 🚀</h5>
  </label>

  <input type="radio" name="model" id="llama3-8b" hidden on:click={() => setModel('llama3-8b-8192')} checked={model === 'llama3-8b-8192'} />
  <label for="llama3-8b">
    <h4>llama3-8b-8192</h4>
    <h5>Meta 最新发布的 Llama3 ✨</h5>
  </label>

  <input type="radio" name="model" id="llama3-70b" hidden on:click={() => setModel('llama3-70b-8192')} checked={model === 'llama3-70b-8192'} />
  <label for="llama3-70b">
    <h4>llama3-70b-8192</h4>
    <h5>Meta 最新发布的 Llama3 ✨</h5>
  </label>

  <input type="radio" name="model" id="0125" hidden on:click={() => setModel('gpt-3.5-turbo-0125')} checked={model === 'gpt-3.5-turbo-0125'} />
  <label for="0125">
    <h4>gpt-3.5-turbo</h4>
    <h5>填写自己的 API Key 以使用</h5>
  </label>
  <input type="radio" name="model" id="gpt4-omni" hidden on:click={() => setModel('gpt-4o-2024-05-13')} checked={model === 'gpt-4o-2024-05-13'} />
  <label for="gpt4-omni">
    <h4>gpt-4-omni</h4>
    <h5>填写自己的 API Key 以使用</h5>
  </label>
  <input type="radio" name="model" id="gpt4-0409" hidden on:click={() => setModel('gpt-4-turbo-2024-04-09')} checked={model === 'gpt-4-turbo-2024-04-09'} />
  <label for="gpt4-0409">
    <h4>gpt-4-turbo</h4>
    <h5>填写自己的 API Key 以使用</h5>
  </label>
  <input type="radio" name="model" id="gpt4-0125" hidden on:click={() => setModel('gpt-4-0125-preview')} checked={model === 'gpt-4-0125-preview'} />
  <label for="gpt4-0125">
    <h4>gpt-4-0125-preview</h4>
    <h5>填写自己的 API Key 以使用</h5>
  </label>
  <input type="radio" name="model" id="moe" hidden on:click={() => setModel('nous-hermes-2-mixtral-8x7b-dpo')} checked={model === 'nous-hermes-2-mixtral-8x7b-dpo'} />
  <label for="moe">
    <h4>nous-hermes-2</h4>
    <h5>基于 Mixtral 的 MOE 模型</h5>
  </label>
  <input type="radio" name="model" id="qwen" hidden on:click={() => setModel('qwen-turbo')} checked={model === 'qwen-turbo'} />
  <label for="qwen">
    <h4 class="rounded-sm text-xs tracking-widest font-mono uppercase">qwen-turbo</h4>
    <h5 class="text-3.1 line-height-1.4em -translate-y-0.5">通义千问</h5>
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
