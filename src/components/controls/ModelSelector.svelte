<script lang="ts">
  import { onMount } from 'svelte'
  import { trackEvent } from '@/utils/track'

  type Model = 'gpt-3.5-turbo-0301' | 'gpt-3.5-turbo-1106' | 'gpt-3.5-turbo-0125' | 'gpt-4-0125-preview' | 'qwen-turbo' | 'claude-3-haiku-20240307' |'mixtral-8x7b-32768' |'gemma-7b-it' | 'nous-hermes-2-mixtral-8x7b-dpo' | 'abab5.5s-chat' | 'abab5.5-chat' | 'abab6-chat';
  let model: Model

  onMount(() => {
    (model = (localStorage.getItem('model') || (import.meta.env.PUBLIC_DEFAULT_MODEL ?? 'gpt-3.5-turbo-0125')) as Model)
    if ( model.startsWith("abab") ||  model.startsWith("gpt") && !model.startsWith("gpt-4")) {
      model = "gemma-7b-it"
    }
  })
  $: typeof localStorage !== 'undefined' && model && localStorage.setItem('model', model)

  function setModel(newModel: Model) {
    model = newModel
    trackEvent('model', { model })
  }
</script>

<div class="grid grid-cols-2 w-full justify-between gap-1.5 rounded-md bg-$c-fg-2 p-1.5 text-sm">
  <input type="radio" name="model" id="mixtral" hidden on:click={() => setModel("mixtral-8x7b-32768")} checked={model === "mixtral-8x7b-32768"} />
  <label for="mixtral">
    <h4>mixtral-8x7b</h4>
    <h5>Groq 提供的 Mixtral 🚀</h5>
  </label>
  <input type="radio" name="model" id="gemma" hidden on:click={() => setModel("gemma-7b-it")} checked={model === "gemma-7b-it"} />
  <label for="gemma">
    <h4>gemma-7b-it</h4>
    <h5>Groq 提供的 Gemma 7B 🚀</h5>
  </label>
  <input type="radio" name="model" id="claude" hidden on:click={() => setModel('claude-3-haiku-20240307')} checked={model === 'claude-3-haiku-20240307'} />
  <label for="claude">
    <h4>claude-3-haiku</h4>
    <h5>崭新 Claude 3 系列</h5>
  </label>
  <input type="radio" name="model" id="gpt4" hidden on:click={() => setModel('gpt-4-0125-preview')} checked={model === 'gpt-4-0125-preview'} />
  <label for="gpt4">
    <h4>gpt-4-0125-preview</h4>
    <h5>填写自己的 API Key 以使用</h5>
  </label>
  <input type="radio" name="model" id="moe" hidden on:click={() => setModel('nous-hermes-2-mixtral-8x7b-dpo')} checked={model === 'nous-hermes-2-mixtral-8x7b-dpo'} />
  <label for="moe">
    <h4>nous-hermes-2</h4>
    <h5>基于 Mixtral 的 MOE 模型✨</h5>
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
