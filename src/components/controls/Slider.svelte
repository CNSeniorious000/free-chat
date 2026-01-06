<script lang="ts">
  import { Slider } from 'bits-ui'
  import { persistedState } from 'svelte-persisted-state'

  interface Props {
    key: string;
    initial: number | undefined;
  }

  const { key, initial }: Props = $props()

  // svelte-ignore state_referenced_locally
  const value = persistedState(key, initial)

  $effect(() => {
    value.current === undefined && localStorage.removeItem(key)
  })
</script>

<button onclick={() => value.current = undefined} disabled={value.current === undefined} title="reset" class="rounded-full bg-$c-fg-10 p-1 transition-background-color disabled:op-30 hover:not-disabled:bg-$c-fg-20" aria-label="reset">
  <div class="i-ci-redo"></div>
</button>

<Slider.Root type="single" min={0} max={1} step={0.05} class="relative mx-1 h-full w-full" value={value.current ?? 1} onValueChange={v => (value.current = v)}>
  <div class="absolute top-1/2 h-0.8 rounded-full bg-$c-fg-10 -left-1 -right-1 -translate-y-1/2"></div>
  {#if value.current !== undefined}
    <Slider.Range class="top-1/2 h-0.8 rounded-full bg-$c-fg-30 -translate-y-1/2 !-left-1" />
  {/if}
  <Slider.Thumb index={0}>
    {#snippet child({ props })}
      <div class:hidden={value.current === undefined} class="top-1/2 h-fit w-0 rounded-full outline-none -translate-y-1/2" {...props}>
        <div class="h-3.2 w-0.8 rounded-full bg-$c-fg ring-0.2rem ring-#f7f7f7 -translate-x-1/2 dark:ring-#24242d focus-visible:ring-$c-fg-20"></div>
      </div>
    {/snippet}
  </Slider.Thumb>
</Slider.Root>
