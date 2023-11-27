<script>
  import Settings from './Settings.svelte'
  import Themetoggle from './Themetoggle.svelte'

  let showSettings = false
</script>

<header>
  <div class="mt-2.5rem fb flex-row select-none items-center transition-margin md:mt-3.5rem">
    <div class="max-w-1/2 fi sm:max-w-2/3">
      <a href="." onclick="return false" w-full mr-1 flex gap-2>
        <!-- <Logo /> -->
        <span class="overflow-hidden text-ellipsis whitespace-nowrap gpt-title <md:transition-all">Free Chat</span>
        <span class="gpt-subtitle">✨</span>
      </a>
    </div>
    <div class="flex">
      <button class="grid h-10 w-10 place-items-center rounded-md transition-background-color hover:bg-$c-fg-5 <md:transition-colors" on:click={() => (showSettings = !showSettings)}>
        <span class="i-ph-gear-six-fill text-lg transition-transform duration-300" class:rotate-30={showSettings} />
      </button>
      <Themetoggle />
    </div>
  </div>
  {#if import.meta.env.PUBLIC_IFRAME_URL}
    <div class="h-22 overflow-hidden transition-all sm:h-27">
      <iframe src={import.meta.env.PUBLIC_IFRAME_URL} class="mb-1 mt-2 h-25 w-full select-none rounded-lg bg-$c-fg-2 ring-$c-fg-40 ring-inset transition-all <sm:mt-3 <sm:w-125% <sm:translate-x--1/10 <sm:translate-y--4 <sm:scale-80% hover:bg-$c-fg-5 hover:ring-1.75" title="embedded advertisement" />
    </div>
  {/if}
</header>

<Settings bind:show={showSettings}></Settings>
