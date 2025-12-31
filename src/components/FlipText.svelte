<script lang="ts">
  import type { Snippet } from 'svelte'

  import { fly } from 'svelte/transition'

  interface Props {
    text: string
    children?: Snippet
  }

  const { text, children }: Props = $props()
</script>

<div class="relative grid overflow-hidden v-middle">
  {#key text}
    {@const direction = text ? 1 : -1}
    <span in:fly={{ y: 15 * direction }} out:fly={{ y: -15 * direction }}>
      {#if text}
        {text}
      {:else if children}
        {@render children()}
      {/if}
    </span>
  {/key}
</div>

<style>
  span {
    grid-area: 1 / 1;
    white-space: nowrap;
  }
</style>
