<script lang="ts">
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'
  import { quintIn, quintOut } from 'svelte/easing'
  import { fade, fly, slide } from 'svelte/transition'

  import { MessagesEvent } from '@/utils/events'

  import Modal from './Modal.svelte'

  let showModal = $state(false)
  let pngReady = $state(false)
  let svgReady = $state(false)
  let showQR = $state(false)
  let showButton = $state(false)

  $effect(() => {
    if (showModal) {
      setTimeout(() => {
        if (showModal) {
          showQR = true
          setTimeout(() => {
            if (showModal)
              showButton = true
          }, 1500)
        }
      }, 1000)
    } else {
      showQR = false
      showButton = false
    }
  })

  onMount(() => {
    document.addEventListener('clearMessages', (ev: Event) => {
      const { length } = (ev as MessagesEvent).detail
      if (length >= 7 && Number(localStorage.getItem('lastTime') ?? '0') - Number(new Date()) < -1000 * 3600 * 24 * 7) showModal = true
    })
  })

  function handleClick() {
    showModal = false
    showQR = false
    showButton = false
    localStorage.setItem('lastTime', String(Number(new Date())))
    toast.success('感谢您的支持！一周内将不会再弹窗~')
  }

</script>

<Modal icon="i-fluent-emoji-folded-hands" bind:show={showModal}>
  {#if showModal}
    <div in:slide|global={{ duration: 800, easing: quintOut }} out:fade|global={{ delay: 300, easing: quintIn }} class="flex flex-col select-text gap-1.5 px-3 leading-relaxed -mx-3 -mt-3 dark:gap-2.5">
      <strong in:fly|global={{ delay: 50, duration: 500, x: -10, easing: quintOut }}>大家好！</strong>
      <div in:fly|global={{ delay: 100, duration: 500, x: -10, easing: quintOut }}>
        我，<a href="https://muspimerol.site/"><strong>Muspi Merol</strong><span class="icon i-line-md-external-link translate-x-0.7 op-50 dark:op-80"></span></a>
        是一名学生、一位活跃的开源开发者，致力于将 JavaScript 的 DX 带给 Python 生态。生活上，我是一个理想主义者，半个 e/acc，典型的 ENFP🐕，欢迎交朋友~
      </div>
      <div in:fly|global={{ delay: 200, duration: 500, x: -10, easing: quintOut }}>我关注 <strong>LLM</strong> 及其应用、<strong>开发者工具</strong>、<strong>社交</strong>、<strong>教育</strong><span class="px-0.5">以及</span><strong>设计</strong>。</div>
      <div in:fly|global={{ delay: 300, duration: 500, x: -10, easing: quintOut }}>大家的持续捐赠鼓励是我维护该免费产品的重要动力，所以我每周在检测到一次长对话之后会提示一次捐赠。谢谢理解！</div>

      <div in:fly|global={{ delay: 400, duration: 500, x: -10, easing: quintOut }}>
        感谢您的使用！我们非常喜欢听到大家的意见，因此有任何问题 / 建议 / 合作意向，欢迎提给我！您可以通过
        <a href="mailto:kilo.meter@foxmail.com"><span class="icon i-ic-twotone-mail"></span>邮件</a>
        /
        <a href="https://tips.free-chat.asia/49a96f2c2064114328ac72c63d7f10c.jpg"><span class="icon i-ic-round-wechat"></span>微信</a>
        /
        <a href="https://t.me/+bIGN2w-toQJjZWRl"><span class="icon i-uim-telegram-alt"></span>Telegram 群组</a>联系我。<strong>但捐赠留言是没法回复的哦~</strong>
      </div>
      {#await import('./Sponsor.svelte').finally(() => { svgReady = true }) then QR}
        {#if showQR && pngReady && svgReady}
          <div in:slide|global={{ duration: 800, easing: quintOut }} class="group relative grid mb-0.5 mt-1.5 h-70 w-full place-items-center rounded-md bg-$c-fg-2 transition-background-color duration-200 hover:bg-$c-fg-5">
            <QR.default show={showQR} />
          </div>
        {/if}
      {/await}
      {#if showButton}
        <div in:slide|global={{ duration: 900, easing: quintOut }}>
          <button onclick={handleClick} type="button" class="mt-1 h-fit w-full rounded-md bg-$c-fg-5 p-2 outline-none transition-all ease-out active:scale-96 hover:scale-98 hover:bg-$c-fg hover:text-$c-bg focus:(ring-1.5 ring-$c-fg-20) hover:!ring-transparent">我知道啦</button>
        </div>
      {/if}
    </div>
  {/if}
</Modal>

<svelte:head>
  {#if showModal}
    <link rel="preload" onload={() => pngReady = true} href="avatar.png" as="image" />
  {/if}
</svelte:head>

<style>
  .icon {
    --uno: inline-block translate-y-0.8 mr-0.7;
  }
</style>
