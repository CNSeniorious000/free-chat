<script context=module lang="ts">
  import { spring } from 'svelte/motion'
  import { derived, writable } from 'svelte/store'
  import { type RGB, getRgb } from '@/utils/color'

  const rgb = spring<RGB | undefined>(undefined, {
    stiffness: 0.2,
    damping: 0.8,
  })

  // input
  const themeColor = writable<RGB | undefined>()
  const overrideColor = writable<RGB | undefined>()

  export function setThemeColor(css: string) {
    themeColor.set(getRgb(css))
  }

  export function setOverrideColor(css: string | undefined) {
    overrideColor.set(css ? getRgb(css) : undefined)
  }

  // output
  export const color = derived(rgb, ($rgb) => {
    if ($rgb) {
      const [r, g, b] = $rgb
      return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
    }
  })
</script>

<script lang="ts">
import { onMount } from 'svelte'

let tag: HTMLMetaElement

onMount(() => {
  tag = document.querySelector('meta[name="theme-color"]')!
})

$: if (tag) $rgb = $overrideColor ?? $themeColor

$: $color && tag?.setAttribute('content', $color)
</script>
