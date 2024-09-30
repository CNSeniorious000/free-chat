<script lang="ts">
  import { persisted } from 'svelte-persisted-store'
  import { Slider } from 'bits-ui'
  export let key: string
  export let initial: number | undefined

  const value = persisted(key, initial)
</script>

<button on:click={() => value.set(undefined)} disabled={$value === undefined} title="reset" class="rounded-full bg-$c-fg-10 p-1 transition-background-color disabled:op-30 hover:not-disabled:bg-$c-fg-20">
  <div class="i-ci-redo" />
</button>

<Slider.Root min={0} max={1} step={0.05} class="relative mx-1 h-full w-full" value={[$value ?? 1]} onValueChange={([v]) => ($value = v)} let:thumbs>
  <div class="absolute top-1/2 h-0.8 rounded-full bg-$c-fg-10 -left-1 -right-1 -translate-y-1/2" />
  {#if $value !== undefined}
    <Slider.Range class="top-1/2 h-0.8 rounded-full bg-$c-fg-20 -translate-y-1/2 !-left-1" />
  {/if}
    {#each thumbs as thumb}
    <Slider.Thumb {thumb} asChild let:builder>
      <div class:hidden={$value === undefined} class="relative top-1/2 h-fit rounded-full bg-#f7f7f7 outline-none -translate-y-1/2 dark:bg-#24242d focus-visible:bg-$c-fg-20" {...builder} use:builder.action>
        <div class="m-0.9 h-3.2 w-0.9 rounded-full bg-$c-fg-80" />
      </div>
    </Slider.Thumb>
    {/each}
</Slider.Root>
