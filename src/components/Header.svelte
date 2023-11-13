<script>
  import Themetoggle from './Themetoggle.svelte'
</script>

<header>
  <div class="mt-2.5rem fb flex-row select-none items-center transition-margin md:mt-3.5rem">
    <div class="max-w-1/2 fi sm:max-w-2/3">
      <a href="." onclick="return false" w-full mr-1 flex gap-2>
        <!-- <Logo /> -->
        <span class="overflow-hidden text-ellipsis whitespace-nowrap gpt-title <md:transition-all">Endless</span>
        <span class="gpt-subtitle">✨</span>
      </a>
    </div>
    <div class="flex">
      <a class="grid h-10 w-10 place-items-center rounded-md transition-background-color hover:bg-$c-fg-5 <md:transition-colors" href="https://tips.free-chat.asia/group.html">
        <span class="i-mdi-wechat text-lg" />
      </a>
      <a class="grid h-10 w-10 place-items-center rounded-md transition-background-color hover:bg-$c-fg-5 <md:transition-colors" href="https://tips.free-chat.asia/sponsorship.html">
        <span class="i-mingcute-pig-money-fill text-lg" />
      </a>
      <Themetoggle />
    </div>
  </div>
  <div text-3 ml-0.2 select-none>Free Chat 分支，使用上下文滑动窗口</div>
  {#if import.meta.env.AD_IFRAME_URL}
    <div class="h-22 overflow-hidden transition-all sm:h-27">
      <iframe src={import.meta.env.AD_IFRAME_URL} class="mb-1 mt-2 h-25 w-full select-none rounded-lg bg-$c-fg-2 ring-$c-fg-40 ring-inset transition-all <sm:mt-3 <sm:w-125% <sm:translate-x--1/10 <sm:translate-y--4 <sm:scale-80% hover:bg-$c-fg-5 hover:ring-1.75" title="embedded advertisement" />
    </div>
  {/if}
</header>
