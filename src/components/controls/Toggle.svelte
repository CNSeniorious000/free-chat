<script lang="ts">
  import { scale } from 'svelte/transition'
  import { persisted } from 'svelte-persisted-store'

  export let key: string
  export let initial = true

  const checked = persisted(key, initial)

  function toggle() {
    $checked = !$checked
  }
</script>

<label class="flex items-center space-x-2">
  <input type="checkbox" class="hidden" bind:checked={$checked} />
  <button class="h-5 w-10 rounded-full bg-$c-fg-20 p-1 transition-colors duration-350" class:!bg-$c-fg-80={$checked} on:click={toggle}>
    <div class="pointer-events-none relative h-3 w-3 translate-x-0 rounded-full bg-white shadow transition-transform duration-350" class:translate-x-5={$checked}>
      {#if $checked}
        <div transition:scale={{ start: 0, duration: 350 }} class="i-bi-check absolute h-full w-full bg-$c-fg-60 dark:!bg-$c-bg"></div>
      {:else}
        <div transition:scale={{ start: 0, duration: 350 }} class="i-bi-x absolute h-full w-full bg-$c-fg-60 dark:!bg-$c-bg"></div>
      {/if}
    </div>
  </button>
</label>
