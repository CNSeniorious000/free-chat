<script lang="ts">
  import openai from '@lobehub/icons-static-svg/icons/openai.svg?raw'
  import { PUBLIC_IFRAME_URL } from 'astro:env/client'
  import { ripple } from 'svelte-ripple-action'
  import { Toaster } from 'svelte-sonner'

  import { trackEvent } from '@/utils/track'

  import Ad from './Ad.svelte'
  import CheckStatus from './CheckStatus.svelte'
  import Inview from './Inview.svelte'
  import Settings from './Settings.svelte'
  import Themetoggle from './Themetoggle.svelte'
  import 'svelte-ripple-action/ripple.css'

  interface Props {
    dark: boolean | undefined;
  }

  const { dark }: Props = $props()

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
        <span class="gpt-subtitle transition-font-size">✨</span>
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
  <div class="mb-0.6 ml-0.2 mt-0.3 flex flex-row select-none items-center gap-0.7 text-2.6 tracking-wider transition-font-size md:text-3 sm:text-2.8 [&>svg]:-translate-y-0.1em">
    已支持
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html openai} OpenAI 最新的 gpt-5 系列模型
  </div>
</div>

{#if PUBLIC_IFRAME_URL}
  <Ad src={PUBLIC_IFRAME_URL} />
{/if}

{#await import('./Sponsorship.svelte') then { default: Sponsorship }}
  <Sponsorship />
{/await}

<Settings bind:show={showSettings}></Settings>
