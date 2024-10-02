<script lang="ts">
  export let src: string

  let show = false
</script>

<div class="relative h-22 overflow-hidden transition-all sm:h-27">
  {#if !show}
    <div class="mb-1 mt-2 h-25 w-full rounded-lg bg-$c-fg-2 <sm:(mt-3 w-125% scale-80% -translate-x-1/10 -translate-y-4)" />
  {/if}
  {#if typeof window !== 'undefined'}
    <iframe class:invisible={!show} on:load={() => { show = true }} {src} class="mb-1 mt-2 h-25 w-full select-none rounded-lg bg-$c-fg-2 ring-$c-fg-40 ring-inset transition-all <sm:(mt-3 w-125% scale-80% -translate-x-1/10 -translate-y-4) hover:bg-$c-fg-5 hover:ring-1.75" title="embedded advertisement" />
  {/if}
</div>
