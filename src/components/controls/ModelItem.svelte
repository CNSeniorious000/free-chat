<script context="module" lang=ts>
  import { persisted } from 'svelte-persisted-store'

  type Model = 'gpt-3.5-turbo-0125' | 'gpt-4o-mini-2024-07-18' | 'Qwen/Qwen2.5-32B-Instruct' | '01-ai/Yi-1.5-34B-Chat-16K' | 'deepseek-ai/DeepSeek-V2.5' | 'THUDM/glm-4-9b-chat' | 'internlm/internlm2_5-20b-chat' | 'mixtral-8x7b-32768' | 'gemma2-9b-it' | 'nous-hermes-2-mixtral-8x7b-dpo' | 'llama-3.2-90b-text-preview' | 'llama3.1-70b';

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

  function setModel(newModel: Model) {
    $model = newModel
    trackEvent('model', { model })
  }
</script>

<input type="radio" name="model" {id} hidden on:click={() => setModel(id)} checked={$model === id}/>

<label use:ripple={{ color: 'var(--c-fg-70)' }} for={id}>
  <h4>{name}</h4>
  <h5>{title}</h5>
</label>

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
    --uno: w-full flex flex-col gap-0.5 rounded bg-$c-fg-5 p-1.5 ring-($c-fg inset) transition-all duration-100 ease-out active:scale-97 @hover:(bg-$c-fg-15 ring-1.2);
  }

  :checked + label {
    --uno: \!bg-$c-fg text-$c-bg @hover:op-80
  }

  label > :global(.ripple) {
    --uno: op-20;
  }

  :checked + label > :global(.ripple) {
    --ripple-color: var(--c-bg);
  }
</style>
