<script lang="ts">
  export let origin: string = ''
</script>

<footer class="mb-4.5rem flex flex-col select-none justify-between gap-2.5 text-xs <sm:mb-1.5rem sm:flex-row <sm:items-center <sm:self-center <md:transition-colors">
  <p>
    <a b-slate-link href="https://ic.free-chat.asia/" data-umami-event="homepage-link">返回 Free Chat 主页</a>
    <span px-0.5 select-none op-20>|</span>
    <a b-slate-link href="mailto:admin@muspimerol.site?subject=❗{origin} Error Report&body={origin} 网站不能正常使用" data-umami-event="bug-report">问题反馈</a>
    <span px-0.5 select-none op-20>|</span>
    <a b-slate-link href="https://tips.free-chat.asia/Free%20Chat%20%E9%9A%90%E7%A7%81%E5%8D%8F%E8%AE%AE" data-umami-event="privacy-page">隐私协议</a>
  </p>
  <p><a class="w-fit flex items-center rounded-full bg-$c-fg-5 px-2 py-1 op-80 transition-opacity -my-1 hover:op-100" style="letter-spacing: 0.75pt" href='https://www.keyanyuedu.com/?channel=freechat' onclick="gtag('event', 'clickAdAtFooter')"><span op-30>本项目由</span><span>上海守扣科技</span><span op-30>独家赞助</span></a></p>
</footer>
