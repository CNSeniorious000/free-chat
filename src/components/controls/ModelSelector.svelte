<script lang="ts">
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'

  type Model = 'gpt-3.5-turbo-0301' | 'gpt-3.5-turbo-0613' | 'gpt-3.5-turbo-1106';
  let model: Model

  onMount(() => (model = (localStorage.getItem('model') as Model) || 'gpt-3.5-turbo-1106'))
  $: typeof localStorage !== 'undefined' && model && localStorage.setItem('model', model)
</script>

<div class="w-full flex flex-row justify-between gap-1.5 rounded-md bg-$c-fg-5 p-1.5 text-sm">
  <input type="radio" name="model" id="0301" hidden on:click={() => (model = 'gpt-3.5-turbo-0301')} checked={model === 'gpt-3.5-turbo-0301'} />
  <label for="0301" in:fly={{ duration: 500, y: 10, delay: 200 }}>
    <h5 class="text-sm font-mono op-40">gpt-3.5-turbo</h5>
    <h4 class="text-2xl font-bold font-mono">0301</h4>
    <div class="text-3.2 -translate-y-0.5">梦开始的地方。只支持4K上下文</div>
  </label>
  <input type="radio" name="model" id="0613" hidden on:click={() => (model = 'gpt-3.5-turbo-0613')} checked={model === 'gpt-3.5-turbo-0613'}/>
  <label for="0613" in:fly={{ duration: 500, y: 10, delay: 300 }}>
    <h5 class="text-sm font-mono op-40">gpt-3.5-turbo</h5>
    <h4 class="text-2xl font-bold font-mono">0613</h4>
    <div class="text-3.2 -translate-y-0.5">较新的模型，初次针对系统消息加强了训练</div>
  </label>
  <input type="radio" name="model" id="1106" hidden on:click={() => (model = 'gpt-3.5-turbo-1106')} checked={model === 'gpt-3.5-turbo-1106'}/>
  <label for="1106" in:fly={{ duration: 500, y: 10, delay: 400 }}>
    <h5 class="text-sm font-mono op-40">gpt-3.5-turbo</h5>
    <h4 class="text-2xl font-bold font-mono">1106</h4>
    <div class="text-3.2 -translate-y-0.5">最新、最快、更便宜，但偶尔过于倾向拒绝回答</div>
  </label>
</div>

<style>
  label {
    --uno: w-full flex flex-col rounded px-2 py-1 ring-$c-fg ring-inset transition-all duration-100 ease-out active:scale-95 hover:bg-$c-fg-15 hover:ring-1.5 [:checked+&]:(\!bg-$c-fg text-$c-bg hover:op-80);
  }
</style>
