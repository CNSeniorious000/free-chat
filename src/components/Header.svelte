<script>
import Themetoggle from './Themetoggle.svelte';
</script>

<header>
  <div class="flex-row mt-2.5rem transition-margin fb items-center select-none md:mt-3.5rem">
    <div class="fi max-w-1/2 sm:max-w-2/3">
      <a href="." onclick="return false" w-full mr-1 flex gap-2>
        <!-- <Logo /> -->
        <span class="gpt-title <md:transition-all overflow-hidden whitespace-nowrap text-ellipsis">Free Chat</span>
        <span class="gpt-subtitle">✨</span>
      </a>
    </div>
    <div class="flex">
      <a class="rounded-md h-10 grid transition-background-color w-10 place-items-center <md:transition-colors hover:bg-$c-fg-5" href="https://free-chat.asia/group.html">
        <span class="text-lg i-mdi-wechat"></span>
      </a>
      <a class="rounded-md h-10 grid transition-background-color w-10 place-items-center <md:transition-colors hover:bg-$c-fg-5" href="https://free-chat.asia/sponsorship.html">
        <span class="text-lg i-mingcute-pig-money-fill"></span>
      </a>
      <Themetoggle />
    </div>
  </div>
  {#if import.meta.env.AD_IFRAME_URL}
  <div class="h-22 transition-all overflow-hidden sm:h-27">
    <iframe src={import.meta.env.AD_IFRAME_URL} class="rounded-lg bg-$c-fg-2 h-25 ring-inset mt-2 mb-1 w-full transition-all ring-$c-fg-40 select-none <sm:mt-3 <sm:w-125% <sm:scale-80% <sm:translate-x--1/10 <sm:translate-y--4 hover:bg-$c-fg-5 hover:ring-1.75" title="embedded advertisement"></iframe>
  </div>
  {/if}  
</header>
