import { useKeyDownList } from '@solid-primitives/keyboard'

import { useChat } from '@/context/ChatContext'
import { isMacOS } from '@/lib/platform'

export default () => {
  const { streaming, messageList, systemRoleEditing } = useChat()
  const modifierKey = isMacOS() ? '⌥ Opt' : '⌥ Alt'
  const pressedKeys = useKeyDownList()
  const altPressed = () => !isMacOS() && pressedKeys().includes('ALT')

  return (
    <>
      {
        !streaming() && messageList().length === 0 && !systemRoleEditing() && (
          <div id="tips" class="relative flex flex-col select-none gap-5 rounded-md bg-$c-fg-2 p-7 text-sm op-50 transition-opacity">
            <span class="absolute right-0 top-0 h-fit w-fit rounded-bl-md rounded-rt-md bg-$c-fg-5 px-2 py-1 text-$c-fg-50 font-bold">TIPS</span>
            <p><span class="rounded-md bg-$c-fg-5 px-1.75 py-1 font-mono ring-1.2 ring-$c-fg-20">B</span> &nbsp;开启/关闭跟随最新消息功能 </p>
            <p><span class="rounded-md bg-$c-fg-5 px-1.75 py-1 font-mono ring-1.2 ring-$c-fg-20">/</span> &nbsp;聚焦到输入框 </p>
            <p><span class="rounded-md bg-$c-fg-5 px-1.75 py-1 font-mono ring-1.2 ring-$c-fg-20" classList={{ '!bg-$c-fg text-$c-bg !ring-$c-fg': altPressed() }}>{modifierKey}</span> + <span class="rounded-md bg-$c-fg-5 px-1.75 py-1 font-mono ring-1.2 ring-$c-fg-20">C</span> &nbsp;清空上下文 </p>
            <p><span class="rounded-md bg-$c-fg-5 px-1.75 py-1 font-mono ring-1.2 ring-$c-fg-20" classList={{ '!bg-$c-fg text-$c-bg !ring-$c-fg': altPressed() }}>{modifierKey}</span> + <span class="rounded-md bg-$c-fg-5 px-1.75 py-1 font-mono ring-1.2 ring-$c-fg-20">O</span> &nbsp;打开/关闭设置 </p>
            <p><span class="rounded-md bg-$c-fg-5 px-1.75 py-1 font-mono ring-1.2 ring-$c-fg-20" classList={{ '!bg-$c-fg text-$c-bg !ring-$c-fg': altPressed() }}>{modifierKey}</span> + <span class="rounded-md bg-$c-fg-5 px-1.75 py-1 font-mono ring-1.2 ring-$c-fg-20">Backspace</span> &nbsp;删除最后一条消息 </p>
          </div>
        )
      }
    </>
  )
}
