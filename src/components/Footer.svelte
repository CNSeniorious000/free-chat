<script lang="ts">
  interface Props {
    origin?: string;
  }

  const { origin = '' }: Props = $props()
</script>

<footer class="mb-4.5rem flex flex-col select-none justify-between gap-2.5 text-xs <sm:mb-1.5rem sm:flex-row <sm:items-center <sm:self-center <md:transition-colors">
  <p>
    <a b-slate-link href="https://ic.free-chat.asia/" data-umami-event="homepage-link">返回 Free Chat 主页</a>
    <span px-0.5 select-none op-20>|</span>
    <a b-slate-link href="mailto:me@promplate.dev?subject=❗{origin} Error Report&body={origin} 网站不能正常使用" data-umami-event="bug-report">问题反馈</a>
    <span px-0.5 select-none op-20>|</span>
    <a b-slate-link href="https://tips.free-chat.asia/Free%20Chat%20%E9%9A%90%E7%A7%81%E5%8D%8F%E8%AE%AE" data-umami-event="privacy-page">隐私协议</a>
  </p>
  <p z-1 class="group sm:[&_*]:(duration-300)">
    <a class="flex items-center gap-1 rounded-full px-2 py-1 transition -my-1 hover:bg-$c-fg-5 not-hover:op-80" href="https://muspimerol.site/" data-umami-event="tagline-clicked">
      <span op-30>Built by</span>
      <span>Muspi Merol</span>
      <span class="ml-0.4 size-1.6 rounded-full bg-current transition-all group-not-hover:(op-0 -mr-4.7) <sm:hidden"></span>
    </a>
  </p>
</footer>
