<script lang="ts">
  import { onMount } from 'svelte'

  let apiKey: string

  onMount(() => (apiKey = localStorage.getItem('apiKey') ?? ''))
  $: typeof localStorage !== 'undefined' && typeof apiKey !== 'undefined' && localStorage.setItem('apiKey', apiKey)
</script>

<input bind:value={apiKey} type="text" placeholder="sk-******** / sess-********" class="rounded-md bg-$c-fg-2 px-2.5 py-2 text-sm font-light font-mono outline-none placeholder:text-$c-fg-30" />
