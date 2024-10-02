<script lang="ts">
  import { fade, fly, slide } from 'svelte/transition'
  import { quintIn, quintOut } from 'svelte/easing'
  import { toast } from 'svelte-sonner'
  import { onMount } from 'svelte'
  import { MessagesEvent } from '@/utils/events'
  import Modal from './Modal.svelte'

  let showModal = false
  let showQR = false
  let showButton = false

  $: if (showModal) {
    setTimeout(() => {
      if (showModal) {
        showQR = true
        setTimeout(() => {
          if (showModal)
            showButton = true
        }, 3000)
      }
    }, 2000)
  } else {
    showQR = false
    showButton = false
  }

  onMount(() => {
    document.addEventListener('clearMessages', (ev: Event) => {
      const { length } = (ev as MessagesEvent).detail
      if (length >= 7 && Number(localStorage.getItem('lastTime') ?? '0') - Number(new Date()) < -1000 * 3600 * 24) showModal = true
    })
  })

  function handleClick() {
    showModal = false
    localStorage.setItem('lastTime', String(Number(new Date())))
    toast.success('感谢您的支持！24h 内将不会再弹窗~')
    setTimeout(() => toast.info('因为持续捐赠是我们运营的动力，所以我们最多在24h弹出一次，且仅会发生在一次有效的长对话之后'), 1000)
  }

</script>

<Modal icon="i-fluent-emoji-folded-hands" bind:show={showModal}>
  {#if showModal}
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
      <div in:fly|global={{ delay: 150, duration: 500, x: -10, easing: quintOut }}><strong>本人最近在开发 <a href="https://zh.promplate.dev/">一个提示工程框架</a></strong>欢迎了解</div>
      <div in:fly|global={{ delay: 200, duration: 500, x: -10, easing: quintOut }}>大家的捐赠鼓励是我开发新的产品和优化现有的功能的动力之一。</div>
      <div in:fly|global={{ delay: 250, duration: 500, x: -10, easing: quintOut }}>总之，希望大家不吝捐赠、欢迎大家多多反馈！最近在忙学校事务，所以可能不会积极更新，见谅~</div>
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

<svelte:head>
  {#if showModal}
    <link rel="preload" href="avatar.png" as="image" />
  {/if}
</svelte:head>

<style>
  .icon {
    --uno: inline-block translate-y-0.8 mr-0.7;
  }
</style>
