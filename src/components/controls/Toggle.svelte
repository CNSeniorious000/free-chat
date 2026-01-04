<script lang="ts">
  import { persistedState } from 'svelte-persisted-state'
  import { scale } from 'svelte/transition'

  interface Props {
    key: string;
    initial?: boolean;
  }

  const { key, initial = true }: Props = $props()

  // svelte-ignore state_referenced_locally
  const checked = persistedState(key, initial, {
    beforeWrite: (value) => {
      // Trigger custom event before writing to localStorage
      document.dispatchEvent(new CustomEvent('localStorageSet', {
        detail: { key, value: String(value) },
      }))
      return value
    },
  })

  function toggle() {
    checked.current = !checked.current
  }
</script>

<label class="flex items-center space-x-2">
  <input type="checkbox" class="hidden" bind:checked={checked.current} />
  <button class="h-4 w-8 rounded-full bg-$c-fg-20 p-0.8 transition-colors duration-350" class:!bg-$c-fg-80={checked.current} onclick={toggle}>
    <div class="pointer-events-none relative h-2.4 w-2.4 translate-x-0 rounded-full bg-white shadow transition-transform duration-350" class:translate-x-4={checked.current}>
      {#if checked.current}
        <div transition:scale={{ start: 0, duration: 350 }} class="i-bi-check absolute h-full w-full bg-$c-fg-60 dark:!bg-$c-bg"></div>
      {:else}
        <div transition:scale={{ start: 0, duration: 350 }} class="i-bi-x absolute h-full w-full bg-$c-fg-60 dark:!bg-$c-bg"></div>
      {/if}
    </div>
  </button>
</label>
