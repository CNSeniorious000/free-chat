<script context="module" lang="ts">
  import { writable } from 'svelte/store'
  import { color, setOverrideColor } from './ThemeColor.svelte'

  const bannerText = writable('')
  const open = writable(false)

  let timeoutId: ReturnType<typeof setTimeout>

  export function setBanner(content: string, autoCloseInterval = 0) {
    bannerText.set(content)
    open.set(true)
    setOverrideColor('var(--c-fg)')
    clearTimeout(timeoutId)
    autoCloseInterval && (timeoutId = setTimeout(end, autoCloseInterval))
  }

  function end() {
    open.set(false)
    setOverrideColor(undefined)
  }
</script>

<div class="pointer-events-none fixed left-0 right-0 z-10000 h-fit transition duration-500 -top-1px" class:-translate-y-full={!$open} class:shadow-lg={$open}>
  <div class="transition-border-radius duration-500" class:rounded-b-0.45em={$open} style:background={$color}>
    <div class="text-sm op-0 transition-opacity duration-200" class:open={$open}>
      <div class="translate-y-1/2 transition-transform duration-500 delay-0" class:!translate-y-0={$open}>

        <div class="self-center p-3 text-center text-$c-bg">
          {$bannerText}
        </div>

      </div>
    </div>
  </div>
</div>

<style>
  .open {
    --uno: op-100 duration-420 delay-80;
  }
</style>
