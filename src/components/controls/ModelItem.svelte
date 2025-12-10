<script module lang="ts">
  import { PUBLIC_DEFAULT_MODEL } from 'astro:env/client'
  import { persisted } from 'svelte-persisted-store'

  type Model = 'gpt-oss-120b' | 'glm-4.5-flash' | 'z-ai/glm-4.5-air:free' | 'zai-glm-4.6' | 'qwen-3-32b' | 'qwen-3-235b-a22b-instruct-2507' | 'DeepSeek-V3.1-Terminus' | 'Llama-4-Maverick-17B-128E-Instruct' | 'llama-3.3-70b' | 'Phi-4' | 'Mistral-medium-2505' | 'Mistral-large-2411' | 'yi-lightning' | 'grok-code-fast-1' | 'mistralai/devstral-2512:free' | 'gemma-3-27b-it' | 'gemini-2.5-flash' | 'nex-agi/deepseek-v3.1-nex-n1:free' | 'Cohere-command-a' | 'moonshotai/kimi-k2-instruct-0905' | 'tngtech/tng-r1t-chimera:free' | 'deepseek-ai/DeepSeek-V3.2-Exp' | 'kwaipilot/kat-coder-pro:free' | 'arcee-ai/trinity-mini:free' | 'allenai/olmo-3-32b-think:free' | 'amazon/nova-2-lite-v1:free' | 'azure:gpt-5-chat' | 'azure:gpt-4.1' | 'azure:o3' | 'azure:o4-mini'

  const defaultModel = PUBLIC_DEFAULT_MODEL as Model

  function asIs(value: Model) {
    return value
  }

  export const model = persisted('model', defaultModel, { syncTabs: false, serializer: { stringify: asIs, parse: asIs } })
</script>

<script lang="ts">
  import { trackEvent } from '@/utils/track'

  import { ripple } from '../../utils/ripple'

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
    --uno: w-full flex flex-col gap-0.5 rounded bg-$c-fg-5 p-1.5 outline-none ring-($c-fg inset) transition-all duration-100 ease-out active:scale-97 @hover:(bg-$c-fg-15 ring-1.2) focus-visible:ring-1.2;
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
