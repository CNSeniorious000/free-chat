<script lang="ts">
  import { ripple } from 'svelte-ripple-action'
  import { setThemeColor } from './ThemeColor.svelte'
  interface Props {
    show?: boolean;
    icon: string;
    children?: import('svelte').Snippet;
    inside?: import('svelte').Snippet;
  }

  // eslint-disable-next-line prefer-const
  let { show = $bindable(true), icon, children, inside }: Props = $props()

  let timeoutId: ReturnType<typeof setTimeout>
  let transitioning = $state(false)

  function darkenThemeColor(show: boolean) {
    if (typeof window === 'undefined') return

    clearTimeout(timeoutId)

    let color: string

    if (!show) {
      color = 'var(--c-bg)'
    } else {
      const isDark = document.documentElement.classList.contains('dark')
      color = isDark ? '#141419' : '#e1e1e1'
    }

    clearTimeout(timeoutId)

    if (transitioning)
      setThemeColor(color) // immediately
    else
      timeoutId = setTimeout(() => setThemeColor(color), 200)
  }

  $effect(() => {
    darkenThemeColor(show)
  })
</script>

<div role="none" onclick={() => (show = false)} class="fixed inset-0 z-100 bg-black/10 transition-opacity duration-800 dark:bg-black/40" class:pointer-events-none={!show} class:op-0={!show} ontransitionstart={() => { transitioning = true }} ontransitionend={() => { transitioning = false }}></div>
<section class="pointer-events-none fixed bottom-0 left-0 right-0 z-1000 flex flex-row select-none justify-center tracking-wide transition duration-400" class:[&_*]:pointer-events-auto={show} class:op-0={!show} class:translate-y-10={!show} class:ease-out={show} class:ease-in={!show}>
  <div class="relative m-5vmin w-xl flex flex-col gap-3 rounded-lg bg-$c-bg p-5 shadow-xl [&_a]:(mx-1 border-b-1.5 border-$c-fg-20 pb-0.3 transition-border-color dark:border-$c-fg) [&_a:hover]:(border-$c-fg-60 dark:border-$c-fg-40)">
    <div class="relative z-1 flex flex-row items-center gap-3 text-4xl">
      <div class="{icon} absolute right-1/2 translate-x-1/2 -translate-y-1/2"></div>
      <div class="{icon} absolute right-1/2 translate-x-1/2 scale-60 blur-15 -translate-y-1/4"></div>
    </div>

    <div class="relative max-h-80vh overflow-hidden -m-5 -mt-8">
      <div data-lenis-prevent class="h-full flex flex-col gap-3 overflow-y-scroll p-5 pt-8 scrollbar-none">
        {@render children?.()}

        {#if inside}
          <div>
            <button use:ripple type="button" class="grid mt-1 h-fit w-full place-items-center rounded-md bg-$c-fg-5 p-2 outline-none transition-all ease-out active:scale-96 hover:scale-98 [&>.ripple]:(bg-$c-fg op-20) hover:bg-$c-fg hover:text-$c-bg focus-visible:(ring-1.5 ring-$c-fg-20) [&:hover>.ripple]:!bg-$c-bg hover:!ring-transparent" onclick={() => (show = !show)}>
              {@render inside?.()}
            </button>
          </div>
        {/if}
      </div>

      <div class="pointer-events-none absolute inset-0 flex flex-col justify-between overflow-hidden rounded-lg [&>*]:(pointer-events-none h-16) -my-12" role="presentation">
        <div class="bg-gradient-(from-$c-bg to-transparent to-b)"></div>
        <div class="bg-gradient-(from-$c-bg to-transparent to-t)"></div>
      </div>
    </div>
  </div>
</section>
