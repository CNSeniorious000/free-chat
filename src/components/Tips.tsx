import { isMacOS } from '@/lib/platform'

import { HotKey } from './HotKey'

export default () => {
  const modifierKey = isMacOS() ? '⌥ Opt' : '⌥ Alt'

  return (
    <div id="tips" class="relative flex flex-col select-none gap-5 rounded-md bg-$c-fg-2 p-7 text-sm op-50 transition-opacity">
      <span class="absolute right-0 top-0 h-fit w-fit rounded-bl-md rounded-rt-md bg-$c-fg-5 px-2 py-1 text-$c-fg-50 font-bold">TIPS</span>
      <p><HotKey key="B" /> &nbsp;开启/关闭跟随最新消息功能 </p>
      <p><HotKey key="/" /> &nbsp;聚焦到输入框 </p>
      <p><HotKey text={modifierKey} key="ALT" /> + <HotKey text="C" key="C" /> &nbsp;清空上下文 </p>
      <p><HotKey text={modifierKey} key="ALT" /> + <HotKey text="O" key="O" /> &nbsp;打开/关闭设置 </p>
      <p><HotKey text={modifierKey} key="ALT" /> + <HotKey text="Backspace" key="BACKSPACE" /> &nbsp;删除最后一条消息 </p>
    </div>
  )
}
