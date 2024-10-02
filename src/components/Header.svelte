<script lang="ts">
  import { onMount } from 'svelte'
  import { Toaster } from 'svelte-sonner'
  import { ripple } from 'svelte-ripple-action'
  import { LocalStorageSetEvent } from '@/utils/events'
  import { trackEvent } from '@/utils/track'
  import Ad from './Ad.svelte'
  import CheckStatus from './CheckStatus.svelte'
  import Settings from './Settings.svelte'
  import Themetoggle from './Themetoggle.svelte'
  import 'svelte-ripple-action/ripple.css'

  export let dark: boolean | undefined

  onMount(() => {
    const setItem = localStorage.setItem.bind(localStorage)

    localStorage.setItem = function(key: string, value: string) {
      setItem(key, value)
      document.dispatchEvent(new LocalStorageSetEvent('localStorageSet', key, value))
    }
  })

  let showSettings = false
</script>

<Toaster position="top-center" />

<CheckStatus />

<header>
  <div class="mt-2.5rem fb flex-row select-none items-center transition-margin md:mt-3.5rem">
    <div class="max-w-2/3 fi">
      <a href="." on:click|preventDefault class="mr-1 w-full flex gap-2">
        <!-- <Logo /> -->
        <span class="overflow-hidden text-ellipsis whitespace-nowrap gpt-title <sm:text-xl <md:transition-all">Endless Chat</span>
        <span class="gpt-subtitle transition-font-size <sm:text-xl">✨</span>
      </a>
    </div>
    <div class="flex">
      <button use:ripple={{ color: 'var(--c-fg-10)', maxRadius: 60 }} class="grid h-10 w-10 place-items-center rounded-md transition-background-color hover:bg-$c-fg-2 <md:transition-colors" on:click={() => { showSettings = !showSettings; trackEvent('open-settings') }}>
        <span class="i-ph-gear-six-fill text-lg transition-transform duration-300" class:rotate-30={showSettings} />
      </button>
      <Themetoggle {dark} />
    </div>
  </div>
</header>

<div class="mb-0.6 ml-0.2 mt-0.3 flex flex-row select-none items-center gap-0.7 text-2.6 tracking-wider transition-font-size sm:text-3">
  已支持
  <div class="i-logos-meta-icon text-0.8em" />
  最新的 llama 3.2
</div>

{#if import.meta.env.PUBLIC_IFRAME_URL}
  <Ad src={import.meta.env.PUBLIC_IFRAME_URL} />
{/if}

{#await import('./Sponsorship.svelte') then { default: Sponsorship }}
  <Sponsorship />
{/await}

<Settings bind:show={showSettings}></Settings>
