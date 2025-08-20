import { useChat } from '@/context/ChatContext'

export default () => {
  const { streaming, messageList, systemRoleEditing } = useChat()

  return (
    <>
      {
        !streaming() && messageList().length === 0 && !systemRoleEditing() && (
          <div id="tips" class="relative flex flex-col select-none gap-5 rounded-md bg-$c-fg-2 p-7 text-sm op-50 transition-opacity">
            <span class="absolute right-0 top-0 h-fit w-fit rounded-bl-md rounded-rt-md bg-$c-fg-5 px-2 py-1 text-$c-fg-50 font-bold">TIPS</span>
            <p><span class="rounded-md bg-$c-fg-5 px-1.75 py-1 font-mono ring-1.2 ring-$c-fg-20">B</span> &nbsp;开启/关闭跟随最新消息功能 </p>
            <p><span class="rounded-md bg-$c-fg-5 px-1.75 py-1 font-mono ring-1.2 ring-$c-fg-20">/</span> &nbsp;聚焦到输入框 </p>
            <p><span class="rounded-md bg-$c-fg-5 px-1.75 py-1 font-mono ring-1.2 ring-$c-fg-20">Alt/Option</span> + <span class="rounded-md bg-$c-fg-5 px-1.75 py-1 font-mono ring-1.2 ring-$c-fg-20">C</span> &nbsp;清空上下文 </p>
            <p><span class="rounded-md bg-$c-fg-5 px-1.75 py-1 font-mono ring-1.2 ring-$c-fg-20">鼠标中键点击左上标题</span> &nbsp;新窗口打开新会话 </p>
            <p><span class="rounded-md bg-$c-fg-5 px-1.75 py-1 font-mono ring-1.2 ring-$c-fg-20">PageUp</span> / <span class="rounded-md bg-$c-fg-5 px-1.75 py-1 font-mono ring-1.2 ring-$c-fg-20">PageDn</span> &nbsp;回到顶部 / 底部 </p>
          </div>
        )
      }
    </>
  )
}
