<script lang="ts">
  import { slide } from 'svelte/transition'
  import { quintIn, quintOut } from 'svelte/easing'
  import Modal from './Modal.svelte'
  import Selector from './controls/ModelSelector.svelte'
  import APIKeyInput from './controls/APIKeyInput.svelte'

  export let show: boolean
</script>

<Modal bind:show icon="i-fluent-emoji-flat-eight-pointed-star">
  <div class="i-fluent-thumb-like-24-filled text-lg" slot="inside"></div>
  {#if show}
    <div class="w-full flex flex-col gap-2 -mt-3" in:slide|global={{ easing: quintOut, duration: 800 }} out:slide|global={{ easing: quintIn, duration: 400 }}>
      <h3>选择 LLM</h3>
      <Selector />
      <hr class="mx-0.5 my-3 h-0.5 b-0 rounded-full bg-$c-fg-50 op-10" />
      <h3>使用自己的 OpenAI API Key</h3>
      <APIKeyInput />
      <hr class="mx-0.5 my-3 h-0.5 b-0 rounded-full bg-$c-fg-50 op-10" />
    </div>
  {/if}
</Modal>
