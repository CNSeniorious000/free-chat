<script context="module" lang=ts>
  import { persisted } from 'svelte-persisted-store'

  type Model = 'gpt-3.5-turbo-0125' | 'gpt-4o-mini-2024-07-18' | 'Qwen/Qwen2.5-32B-Instruct' | '01-ai/Yi-1.5-34B-Chat-16K' | 'deepseek-ai/DeepSeek-V2.5' | 'THUDM/glm-4-9b-chat' | 'internlm/internlm2_5-20b-chat' | 'mixtral-8x7b-32768' | 'gemma2-9b-it' | 'nous-hermes-2-mixtral-8x7b-dpo' | 'llama-3.2-90b-text-preview' | 'llama3.1-70b' | 'azure:gpt-4o' | 'azure:gpt-4o-mini' | 'AI21-Jamba-1.5-Large' | 'AI21-Jamba-1.5-Mini' | 'Phi-3.5-MoE-instruct' | 'Meta-Llama-3.1-405B-Instruct' | 'Mistral-Nemo' | 'Mistral-large-2407';

  const defaultModel = (import.meta.env.PUBLIC_DEFAULT_MODEL ?? 'gpt-4o-mini') as Model

  function asIs(value: Model) {
    return value
  }

  export const model = persisted('model', defaultModel, { syncTabs: false, serializer: { stringify: asIs, parse: asIs } })
</script>

<script lang="ts">
  import { ripple } from 'svelte-ripple-action'
  import { trackEvent } from '@/utils/track'

  export let id: Model
  export let name: string
  export let title: string

  function choose() {
    $model = id
    trackEvent('model', { model })
  }
</script>

<input tabindex="-1" type="radio" name="model" {id} class="sr-only" on:select={choose} checked={$model === id} />

<button use:ripple={{ color: 'var(--c-fg)' }} on:click={choose} class="cursor-auto text-left">
  <h4>{name}</h4>
  <h5>{title}</h5>
</button>

<style>
  h4 {
    --uno: rounded-sm text-xs tracking-widest font-mono uppercase op-50;
  }

  h5 {
    --uno: text-3.1 line-height-1.4em -translate-y-0.5;
  }

  button {
    --uno: w-full flex flex-col gap-0.5 rounded bg-$c-fg-5 p-1.5 outline-none ring-($c-fg inset) transition-all duration-100 ease-out active:scale-97 @hover:(bg-$c-fg-15 ring-1.2) focus:ring-1.2;
  }

  :checked + button {
    --uno: \!bg-$c-fg text-$c-bg @hover:op-80;
  }

  button > :global(.ripple) {
    --uno: op-15;
  }

  :checked + button > :global(.ripple) {
    --ripple-color: var(--c-bg);
  }
</style>
