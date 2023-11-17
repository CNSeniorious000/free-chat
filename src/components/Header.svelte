<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, fly, slide } from 'svelte/transition'
  import { quintIn, quintOut } from 'svelte/easing'
  import { Toaster, toast } from 'svelte-sonner'
  import { MessagesEvent } from '@/utils/events'
  import Themetoggle from './Themetoggle.svelte'
  import Modal from './Modal.svelte'

  let showSponsorship = false
  let showQR = false
  let showButton = false

  $: if (showSponsorship) {
    setTimeout(() => {
      showQR = true
      setTimeout(() => {
        showButton = true
      }, 5000)
    }, 2000)
  } else {
    showQR = false
    showButton = false
  }

  onMount(() => {
    document.addEventListener('clearMessages', (ev: Event) => {
      const { length } = (ev as MessagesEvent).detail
      if (length >= 5 && Number(localStorage.getItem('lastTime') ?? '0') - Number(new Date()) < -1000 * 3600 * 24) showSponsorship = true
    })
  })

  function handleClick() {
    showSponsorship = false
    localStorage.setItem('lastTime', String(Number(new Date())))
    toast.success('感谢您的支持！24h 内将不会再弹窗~')
    setTimeout(() => toast.info('因为持续捐赠是我们运营的动力，所以我们最多在24h弹出一次，且仅会发生在一次有效的对话之后'), 1000)
  }
</script>

<Toaster position="top-center" closeButton />

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
  {#if import.meta.env.PUBLIC_IFRAME_URL}
    <div class="h-22 overflow-hidden transition-all sm:h-27">
      <iframe src={import.meta.env.PUBLIC_IFRAME_URL} class="mb-1 mt-2 h-25 w-full select-none rounded-lg bg-$c-fg-2 ring-$c-fg-40 ring-inset transition-all <sm:mt-3 <sm:w-125% <sm:translate-x--1/10 <sm:translate-y--4 <sm:scale-80% hover:bg-$c-fg-5 hover:ring-1.75" title="embedded advertisement" />
    </div>
  {/if}
</header>

<Modal showButton={false} icon="i-fluent-emoji-folded-hands" bind:show={showSponsorship}>
  {#if showSponsorship}
    <div in:slide|global={{ duration: 800, easing: quintOut }} out:fade|global={{ delay: 300, easing: quintIn }} class="flex flex-col gap-1.5 -mt-3 dark:gap-2.5">
      <strong in:fly|global={{ delay: 50, duration: 500, x: -10, easing: quintOut }}>亲爱的用户：</strong>
      <div in:fly|global={{ delay: 100, duration: 500, x: -10, easing: quintOut }}>
        感谢您的使用！我们非常喜欢听到大家的意见，因此有任何问题 / 建议 / 合作意向，欢迎提给我！您可以通过
        <a href="mailto:kilo.meter@foxmail.com"><span class="icon i-ic-twotone-mail" />邮件</a>
        /
        <a href="https://tips.free-chat.asia/49a96f2c2064114328ac72c63d7f10c.jpg"><span class="icon i-ic-round-wechat" />微信</a>
        /
        <a href="https://t.me/+bIGN2w-toQJjZWRl"><span class="icon i-uim-telegram-alt" />Telegram 群组</a>联系我。
      </div>
      <div in:fly|global={{ delay: 150, duration: 500, x: -10, easing: quintOut }}><strong>我致力于推动 LLM 普惠，但免费的服务离不开大家持续的的捐赠支持。如果这个软件成功帮到你了，希望你能不吝赐赠。</strong>无论你是和我一样贫穷的学生党，还是事业有成的职场人士，你的支持对我同等重要。</div>
      <div in:fly|global={{ delay: 200, duration: 500, x: -10, easing: quintOut }}>前段时间我忙于实习工作和 LLM 领域的一些基础建设，我没有花时间维护这个项目，同时也几乎没有得到什么捐赠。虽然我还是贴钱给大家提供存量服务，但是捐赠能让我更有动力开发新的产品和优化现有的功能。</div>
      <div in:fly|global={{ delay: 250, duration: 500, x: -10, easing: quintOut }}>总之，希望大家不吝捐赠、多多反馈！</div>
      {#await import('./Sponsor.svelte') then QR}
        {#if showQR}
          <div in:slide|global={{ duration: 800, easing: quintOut }} class="group relative grid mb-0.5 mt-1.5 h-70 w-full place-items-center rounded-md bg-$c-fg-2 transition-background-color duration-200 hover:bg-$c-fg-5">
            <svelte:component this={QR.default} show={showQR} />
          </div>
        {/if}
      {/await}
      {#if showButton}
        <div in:slide|global={{ duration: 900, easing: quintOut }}>
          <button on:click={handleClick} type="button" class="mt-1 h-fit w-full rounded-md bg-$c-fg-5 p-2 outline-none transition-all ease-out active:scale-96 hover:scale-98 hover:bg-$c-fg hover:text-$c-bg focus:(ring-1.5 ring-$c-fg-20) hover:!ring-transparent">我知道啦</button>
        </div>
      {/if}
    </div>
  {/if}
</Modal>

<style>
  .icon {
    --uno: inline-block translate-y-0.8 mr-0.7;
  }
</style>
