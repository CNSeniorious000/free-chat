import { Index, Match, Switch, createEffect, createSignal, onMount } from 'solid-js'
import { generateSignature } from '@/utils/auth'
import IconClear from './icons/Clear'
import MessageItem from './MessageItem'
import SystemRoleSettings from './SystemRoleSettings'
import ErrorMessageItem from './ErrorMessageItem'
import type { ChatMessage, ErrorMessage } from '@/types'
import type { Setter } from 'solid-js'

export default () => {
  let inputRef: HTMLTextAreaElement
  let bgd: HTMLDivElement
  const [currentSystemRoleSettings, _setCurrentSystemRoleSettings] = createSignal('')
  const [systemRoleEditing, setSystemRoleEditing] = createSignal(false)
  const [messageList, setMessageList] = createSignal<ChatMessage[]>([])
  const [currentError, setCurrentError] = createSignal<ErrorMessage>()
  const [currentAssistantMessage, setCurrentAssistantMessage] = createSignal('')
  const [loading, setLoading] = createSignal(false)
  const [controller, setController] = createSignal<AbortController>(null)
  const [isStick, _setStick] = createSignal(false)

  let footer = null

  const isHigher = () => {
    const distanceToBottom = footer.offsetTop - window.innerHeight
    const currentScrollHeight = window.scrollY
    return distanceToBottom > currentScrollHeight
  }

  const setCurrentSystemRoleSettings = (systemRole: string) => {
    location.hash = systemRole
    clear()
    _setCurrentSystemRoleSettings(systemRole) ? localStorage.setItem('systemRoleSettings', systemRole) : localStorage.removeItem('systemRoleSettings')
    return systemRole
  }

  const setStick = (stick: boolean) => {
    _setStick(stick) ? localStorage.setItem('stickToBottom', 'stick') : localStorage.removeItem('stickToBottom')
    return stick
  }

  createEffect(() => {
    isStick() && (loading() ? instantToBottom() : smoothToBottom())
  })

  const [mounted, setMounted] = createSignal(false)

  onMount(() => {
    setMounted(true)

    try {
      if (localStorage.getItem('messageList'))
        setMessageList(JSON.parse(localStorage.getItem('messageList')))

      if (localStorage.getItem('stickToBottom') === 'stick')
        setStick(true)

      if (location.hash)
        setCurrentSystemRoleSettings(decodeURIComponent(location.hash).slice(1))
      else if (localStorage.getItem('systemRoleSettings'))
        setCurrentSystemRoleSettings(localStorage.getItem('systemRoleSettings'))
    } catch (err) {
      console.error(err)
    }

    footer = document.querySelector('footer')

    let lastPostion = window.scrollY

    window.addEventListener('scroll', () => {
      const nowPostion = window.scrollY
      if (nowPostion < lastPostion && isHigher()) setStick(false)
      lastPostion = nowPostion
    })

    window.addEventListener('resize', () => {
      requestAnimationFrame(() => {
        if (isHigher() && isStick()) instantToBottom()
        lastPostion = window.scrollY
      })
    })

    window.addEventListener('keydown', (event) => {
      if ((event.target as HTMLElement).nodeName === 'TEXTAREA') return

      if (event.code === 'Slash') {
        event.preventDefault()
        document.querySelector('textarea').focus()
      } else if (event.code === 'KeyB') { setStick(!isStick()) } else if (event.altKey && event.code === 'KeyC') { clear() }
    }, false)

    new MutationObserver(() => isStick() && instantToBottom()).observe(document.querySelector('astro-island > div'), { childList: true, subtree: true })

    window.addEventListener('scroll', () => {
      bgd.style.setProperty('--scroll', `-${document.documentElement.scrollTop / 10}pt`)
    })
  })

  const handleButtonClick = async() => {
    const inputValue = inputRef.value
    if (!inputValue)
      return

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (window?.umami) umami.trackEvent('chat_generate')
    inputRef.value = ''
    setMessageList([
      ...messageList(),
      {
        role: 'user',
        content: inputValue,
      },
    ])
    smoothToBottom()
    requestWithLatestMessage()
  }

  const toBottom = (behavior: 'smooth' | 'instant') => {
    const distanceToBottom = footer.offsetTop - window.innerHeight
    const currentScrollHeight = window.scrollY
    if (distanceToBottom > currentScrollHeight)
      window.scrollTo({ top: distanceToBottom, behavior })
  }

  const smoothToBottom = () => toBottom('smooth')
  const instantToBottom = () => toBottom('instant')

  const requestWithLatestMessage = async() => {
    setLoading(true)
    setCurrentAssistantMessage('')
    setCurrentError(null)
    const storagePassword = localStorage.getItem('pass')
    try {
      const controller = new AbortController()
      setController(controller)
      const requestMessageList = [...messageList()]
      if (currentSystemRoleSettings()) {
        requestMessageList.unshift({
          role: 'system',
          content: currentSystemRoleSettings(),
        })
      }
      const timestamp = Date.now()
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          messages: requestMessageList,
          time: timestamp,
          pass: storagePassword,
          sign: await generateSignature({
            t: timestamp,
            m: requestMessageList?.[requestMessageList.length - 1]?.content || '',
          }),
        }),
        signal: controller.signal,
      })
      if (!response.ok) {
        const error = await response.json()
        console.error(error.error)
        setCurrentError(error.error)
        throw new Error('Request failed')
      }
      const data = response.body
      if (!data)
        throw new Error('No data')

      const reader = data.getReader()
      const decoder = new TextDecoder('utf-8')
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        if (value) {
          const char = decoder.decode(value)
          if (char === '\n' && currentAssistantMessage().endsWith('\n'))
            continue

          if (char)
            setCurrentAssistantMessage(currentAssistantMessage() + char)
        }
        done = readerDone
      }
    } catch (e) {
      console.error(e)
      setLoading(false)
      setController(null)
      return
    }
    archiveCurrentMessage()
  }

  const archiveCurrentMessage = () => {
    if (currentAssistantMessage()) {
      setMessageList([
        ...messageList(),
        {
          role: 'assistant',
          content: currentAssistantMessage(),
        },
      ])
      setCurrentAssistantMessage('')
      setLoading(false)
      setController(null)
      localStorage.setItem('messageList', JSON.stringify(messageList()))
    }
  }

  const clear = () => {
    inputRef.value = ''
    inputRef.style.height = 'auto'
    setMessageList([])
    setCurrentAssistantMessage('')
    localStorage.setItem('messageList', JSON.stringify([]))
    setCurrentError(null)
  }

  const stopStreamFetch = () => {
    if (controller()) {
      controller().abort()
      archiveCurrentMessage()
    }
  }

  const retryLastFetch = () => {
    if (messageList().length > 0) {
      const lastMessage = messageList()[messageList().length - 1]
      if (lastMessage.role === 'assistant')
        setMessageList(messageList().slice(0, -1))

      requestWithLatestMessage()
    }
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.isComposing || e.shiftKey)
      return

    if (e.key === 'Enter') {
      e.preventDefault()
      handleButtonClick()
    }
  }

  return (
    <div class="flex flex-col flex-grow h-full justify-between">
      <div
        ref={bgd}
        class="bg-top-center bg-hero-topography-gray-500/15 h-1000vh w-full translate-y-$scroll transition-opacity top-0 left-0 z--1 duration-1000 fixed op-100 <md:bg-none <md:hiddern"
        class:op-0={!mounted()}
        class:transition-transform={isStick() && loading()}
        class:duration-400={isStick() && loading()}
      />
      <SystemRoleSettings
        canEdit={() => messageList().length === 0}
        systemRoleEditing={systemRoleEditing}
        setSystemRoleEditing={setSystemRoleEditing}
        currentSystemRoleSettings={currentSystemRoleSettings}
        setCurrentSystemRoleSettings={setCurrentSystemRoleSettings as Setter<string>}
      />
      <div class="flex-grow flex w-full items-center justify-center">
        {
        messageList().length === 0 && !systemRoleEditing() && (
          <div id="tips" class="rounded-md flex flex-col bg-$c-fg-2 text-sm p-7 transition-opacity gap-5 relative select-none op-50">
            <span class="rounded-bl-md rounded-rt-md font-bold h-fit bg-$c-fg-5 w-fit py-1 px-2 top-0 right-0 text-$c-fg-50 absolute">TIPS</span>
            <p><span class="rounded-md font-mono bg-$c-fg-5 py-1 px-1.75 ring-1.2 ring-$c-fg-20">B</span> &nbsp;开启/关闭跟随最新消息功能 </p>
            <p><span class="rounded-md font-mono bg-$c-fg-5 py-1 px-1.75 ring-1.2 ring-$c-fg-20">/</span> &nbsp;聚焦到输入框 </p>
            <p><span class="rounded-md font-mono bg-$c-fg-5 py-1 px-1.75 ring-1.2 ring-$c-fg-20">Alt/Option</span> + <span class="rounded-md font-mono bg-$c-fg-5 py-1 px-1.75 ring-1.2 ring-$c-fg-20">C</span> &nbsp;清空上下文 </p>
            <p><span class="rounded-md font-mono bg-$c-fg-5 py-1 px-1.75 ring-1.2 ring-$c-fg-20">鼠标中键点击左上标题</span> &nbsp;新窗口打开新会话 </p>
            <p><span class="rounded-md font-mono bg-$c-fg-5 py-1 px-1.75 ring-1.2 ring-$c-fg-20">PageUp</span> / <span class="rounded-md font-mono bg-$c-fg-5 py-1 px-1.75 ring-1.2 ring-$c-fg-20">PageDn</span> &nbsp;回到顶部 / 底部 </p>
          </div>
        )
        }
      </div>
      <Index each={messageList()}>
        {(message, index) => (
          <MessageItem
            role={message().role}
            message={message().content}
            showRetry={() => (message().role === 'assistant' && index === messageList().length - 1)}
            onRetry={retryLastFetch}
          />
        )}
      </Index>
      {currentAssistantMessage() && (
        <MessageItem
          role="assistant"
          message={currentAssistantMessage}
        />
      )}
      { currentError() && <ErrorMessageItem data={currentError()} onRetry={retryLastFetch} /> }
      <Switch>
        <Match when={!mounted()}>
          <div class="animate-fade-in animate-duration-300 gen-cb-wrapper">
            <div class="flex flex-row gap-2 items-center">
              <span>加载中</span>
              <span i-svg-spinners-6-dots-scale-middle />
            </div>
          </div>
        </Match>
        <Match when={mounted() && loading()}>
          <div class="gen-cb-wrapper">
            <div class="flex flex-row animate-fade-in gap-3 animate-duration-300 items-center">
              <span i-svg-spinners-ring-resize />
              <span>等待响应中</span>
              <div class="gen-cb-stop" onClick={stopStreamFetch}>Stop</div>
            </div>
          </div>
        </Match>
        <Match when={mounted() && !loading()}>
          <div class="gen-text-wrapper" class:op-50={systemRoleEditing()}>
            <textarea
              ref={inputRef}
              disabled={systemRoleEditing()}
              onKeyDown={handleKeydown}
              placeholder="与 ChatGPT 对话"
              autocomplete="off"
              autofocus
              onInput={() => {
                inputRef.style.height = 'auto'
                inputRef.style.height = `${inputRef.scrollHeight}px`
              }}
              rows="1"
              class="gen-textarea"
            />
            <button
              title="Send"
              class="w-10 gen-slate-btn sm:min-w-fit sm:px-3.5"
              onClick={handleButtonClick}
              disabled={systemRoleEditing()}
            >
              <span class="i-iconamoon-send block sm:hidden" />
              <span class="<sm:hidden">发送</span>
            </button>
            <button title="Clear" onClick={clear} disabled={systemRoleEditing()} gen-slate-btn>
              <IconClear />
            </button>
          </div>

        </Match>
      </Switch>
      <div class="rounded-md h-fit w-fit transition-colors bottom-4.25 left-4.25 z-10 fixed sm:bottom-5 sm:left-5 hover:bg-$c-fg-5 active:scale-90" class:stick-btn-on={isStick()}>
        <button class="text-base p-2.5" title="stick to bottom" type="button" onClick={() => setStick(!isStick())}>
          <div i-ph-arrow-line-down-bold />
        </button>
      </div>
    </div>
  )
}
