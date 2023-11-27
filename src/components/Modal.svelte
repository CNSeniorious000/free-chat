<script lang="ts">
  export let show = false
  export let icon: string
</script>

<div class="pointer-events-none fixed inset-0 z-100 bg-black/10 transition-opacity duration-800 dark:bg-black/50" class:pointer-events-none={!show} class:op-0={!show} />
<section class="pointer-events-none fixed bottom-0 left-0 right-0 z-1000 flex flex-row select-none justify-center tracking-wide transition-opacity duration-500" class:pointer-events-none={!show} class:op-0={!show}>
  <div class="m-5vw w-xl flex flex-col gap-3 rounded-lg bg-$c-bg p-5 shadow-xl backdrop-blur-15 [&_a]:(mx-1 border-b-1.5 border-$c-fg-20 pb-0.3 transition-border-color dark:border-$c-fg) [&_a:hover]:(border-$c-fg-60 dark:border-$c-fg-40) dark:bg-#212129c0">
    <div class="relative flex flex-row items-center gap-3 text-4xl">
      <div class="{icon} absolute right-1/2 translate-x-1/2 -translate-y-1/2" />
      <div class="{icon} absolute right-1/2 translate-x-1/2 scale-60 blur-15 -translate-y-1/4" />
    </div>

    <slot />

    {#if $$slots.inside}
      <div>
        <button type="button" class="grid mt-1 h-fit w-full place-items-center rounded-md bg-$c-fg-5 p-2 outline-none transition-all ease-out active:scale-96 hover:scale-98 hover:bg-$c-fg hover:text-$c-bg focus:(ring-1.5 ring-$c-fg-20) hover:!ring-transparent" on:click={() => (show = !show)}>
          <slot name="inside" />
        </button>
      </div>
    {/if}
  </div>
</section>
