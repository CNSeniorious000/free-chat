<script lang="ts">
  import { onMount } from 'svelte'

  let apiKey: string

  onMount(() => (apiKey = localStorage.getItem('apiKey') ?? ''))
  $: typeof localStorage !== 'undefined' && typeof apiKey !== 'undefined' && localStorage.setItem('apiKey', apiKey)
</script>

<input bind:value={apiKey} type="text" placeholder="sk-******** / sess-********" class="w-full rounded bg-$c-fg-5 px-1.5 py-1 font-light font-mono outline-none transition-background-color focus:bg-$c-fg-10 placeholder:text-$c-fg-30" />
