<script module lang="ts">
  import { PUBLIC_DEFAULT_MODEL } from 'astro:env/client'
  import { persisted } from 'svelte-persisted-store'

  type Model = 'qwen-qwq-32b' | 'deepseek-ai/DeepSeek-V3' | 'DeepSeek-R1-Distill-Llama-70B' | 'deepseek-r1-distill-qwen-32b' | 'THUDM/glm-4-9b-chat' | 'internlm/internlm2_5-20b-chat' | 'gemma2-9b-it' | 'nous-hermes-2-mixtral-8x7b-dpo' | 'llama-3.2-90b-vision-preview' | 'llama-3.3-70b' | 'llama3.1-70b' | 'azure:gpt-4o' | 'azure:gpt-4o-mini' | 'Phi-4' | 'Meta-Llama-3.1-405B-Instruct' | 'Mistral-small-2503' | 'Mistral-large-2411' | 'yi-lightning' | 'grok-2-1212' | 'gemma-3-27b-it' | 'gemini-2.0-flash-lite' | 'gemini-2.0-flash-thinking-exp'

  const defaultModel = PUBLIC_DEFAULT_MODEL as Model

  function asIs(value: Model) {
    return value
  }

  export const model = persisted('model', defaultModel, { syncTabs: false, serializer: { stringify: asIs, parse: asIs } })
</script>

<script lang="ts">
  import { ripple } from 'svelte-ripple-action'
  import { trackEvent } from '@/utils/track'

  interface Props {
    id: Model;
    name: string;
    title: string;
  }

  const { id, name, title }: Props = $props()

  function choose() {
    $model = id
    trackEvent('model', { model: id })
  }
</script>

<input tabindex="-1" type="radio" name="model" {id} class="sr-only" onselect={choose} checked={$model === id} />

<button use:ripple={{ color: 'var(--c-fg)' }} onclick={choose} class="cursor-auto text-left">
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
