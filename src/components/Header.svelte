<script lang="ts">
  import { onMount } from 'svelte'
  import { toast, Toaster } from 'svelte-sonner'
  import { ripple } from 'svelte-ripple-action'
  import { LocalStorageSetEvent } from '@/utils/events'
  import { trackEvent } from '@/utils/track'
  import Inview from './Inview.svelte'
  import CheckStatus from './CheckStatus.svelte'
  import Settings from './Settings.svelte'
  import Themetoggle from './Themetoggle.svelte'
  import 'svelte-ripple-action/ripple.css'
  import UseCopy from './UseCopy.svelte'

  interface Props {
    dark: boolean | undefined;
  }

  const { dark }: Props = $props()

  onMount(() => {
    const setItem = localStorage.setItem.bind(localStorage)

    localStorage.setItem = function(key: string, value: string) {
      setItem(key, value)
      document.dispatchEvent(new LocalStorageSetEvent('localStorageSet', key, value))
    }
  })

  let showSettings = $state(false)

  let inView = $state(true)
</script>

<Toaster position="top-center" />

<CheckStatus />

<Inview bind:inView class="absolute left-0 right-0 top-0 h-2rem md:h-3rem" />

<header class="sticky top-0 z-1 mt-2rem select-none transition-margin md:mt-3rem">
  <div class="relative fb flex-row items-center px-2rem py-0.5rem -mx-2rem -mb-0.6rem" class:backdrop-blur-20={!inView}>
    <div class="absolute inset-0 b-b-(1 $c-fg-10) bg-$c-bg op-70 -z-1 <md:transition-background-color" role="presentation" class:hidden={inView}></div>

    <div class="max-w-[calc(100%-5rem-1ch)]">
      <a href="." onclick={(e: Event) => e.preventDefault()} class="w-full fcc gap-1 *:transition-font-size">
        <!-- <Logo /> -->
        <span class="overflow-hidden text-ellipsis whitespace-nowrap gpt-title">Endless Chat</span>
        <span class="transition-font-size gpt-subtitle">✨</span>
      </a>
    </div>
    <div class="flex">
      <button use:ripple={{ color: 'var(--c-fg-10)', maxRadius: 60 }} class="grid h-10 w-10 place-items-center rounded-md transition-background-color hover:bg-$c-fg-2 <md:transition-colors" onclick={() => { showSettings = !showSettings; trackEvent('open-settings') }} aria-label="open settings">
        <span class="i-ph-gear-six-fill text-lg transition-transform duration-300" class:rotate-30={showSettings}></span>
      </button>
      <Themetoggle {dark} />
    </div>
  </div>
</header>

<div class="transition-opacity" class:op-0={!inView} class:duration-400={inView}>
  <UseCopy text="3593665471">
    {#snippet children({ handleClick })}
      <button onclick={() => [handleClick(), toast.success('已复制 QQ 号到剪贴板')]} class="mb-0.6 ml-0.2 mt-0.3 flex flex-row select-none items-center gap-0.7 text-2.6 tracking-wider transition-font-size md:text-3 sm:text-2.8 [&>svg]:-translate-y-0.1em">
        <div class="i-basil-qq-outline"></div>
        客服QQ: 3593665471
      </button>
    {/snippet}
  </UseCopy>
</div>

<Settings bind:show={showSettings}></Settings>
