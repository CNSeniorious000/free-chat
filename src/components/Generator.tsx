import { For, Index, Match, Show, Switch, batch, createEffect, createMemo, createSignal, onMount } from 'solid-js'
import { generateSignature } from '@/utils/auth'
import IconClear from './icons/Clear'
import MessageItem from './MessageItem'
import ErrorMessageItem from './ErrorMessageItem'
import TokenCounter from './TokenCounter'
import type { ChatMessage, ErrorMessage, Message, Preset } from '@/types'

export default () => {
  let inputRef: HTMLTextAreaElement
  let bgd: HTMLDivElement
  let footer: HTMLElement

  const [messageList, setMessageList] = createSignal<ChatMessage[]>([])
  const [currentError, setCurrentError] = createSignal<ErrorMessage | null>(null)
  const [currentAssistantMessage, setCurrentAssistantMessage] = createSignal('')
  const [loading, setLoading] = createSignal(false)
  const [controller, setController] = createSignal<AbortController | null>(null)
  const [inputValue, setInputValue] = createSignal('')
  const [isStick, _setStick] = createSignal(false)
  const [mounted, setMounted] = createSignal(false)
  const [presets, setPresets] = createSignal<Record<string, Preset> | null>(null)
  const [selectedPresetId, setSelectedPresetId] = createSignal<string | null>(null)

  const isHigher = () => {
    const distanceToBottom = footer.offsetTop - window.innerHeight
    const currentScrollHeight = window.scrollY
    return distanceToBottom > currentScrollHeight
  }

  const setStick = (stick: boolean) => {
    _setStick(stick) ? localStorage.setItem('stickToBottom', 'stick') : localStorage.removeItem('stickToBottom')
    return stick
  }

  createEffect(() => {
    isStick() && (loading() ? instantToBottom() : smoothToBottom())
  })

  const preset = createMemo(() => presets() && selectedPresetId() && presets()![selectedPresetId()!])

  const fullMessageList = createMemo(() => selectedPresetId() ? (preset() as Preset).messages.concat(messageList()) : messageList())

  onMount(() => {
    setMounted(true)

    try {
      if (localStorage.getItem('messageList'))
        setMessageList(JSON.parse(localStorage.getItem('messageList') ?? '[]'))

      if (localStorage.getItem('stickToBottom') === 'stick')
        setStick(true)

      createEffect(() => {
        inputRef.value = inputValue()
      })
    } catch (err) {
      console.error(err)
    }

    footer = document.querySelector('footer')!

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
      if ((event.target as HTMLElement).nodeName !== 'TEXTAREA') {
        if (event.code === 'Slash') {
          event.preventDefault()
          inputRef.focus()
        } else if (event.code === 'KeyB') { setStick(!isStick()) }
      }
      if (event.altKey && event.code === 'KeyC') clear()
    }, false)

    new MutationObserver(() => isStick() && instantToBottom()).observe(document.querySelector('astro-island > div')!, { childList: true, subtree: true })

    window.addEventListener('scroll', () => {
      bgd.style.setProperty('--scroll', `-${document.documentElement.scrollTop / 10}pt`)
    })

    fetch('/api/presets').then(res => res.json()).then(data => setPresets(data))
  })

  const handleButtonClick = async() => {
    if (!inputValue())
      return

    batch(() => {
      setMessageList([...messageList(), { role: 'user', content: inputValue() }])
      setInputValue('')
    })

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
    syncRecord()
    setLoading(true)
    setCurrentAssistantMessage('')
    setCurrentError(null)
    const storagePassword = localStorage.getItem('pass')
    try {
      const controller = new AbortController()
      setController(controller)
      const requestMessageList = [...fullMessageList()]
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
    await syncRecord()
  }

  const archiveCurrentMessage = () => {
    if (currentAssistantMessage()) {
      batch(() => {
        setMessageList([...messageList(), { role: 'assistant', content: currentAssistantMessage() }])
        setCurrentAssistantMessage('')
      })
      setLoading(false)
      setController(null)
      localStorage.setItem('messageList', JSON.stringify(messageList()))
    }
  }

  let recordId = null

  const syncRecord = async() => {
    if (messageList().length === 0) return

    if (localStorage.getItem('recordId')) {
      recordId = localStorage.getItem('recordId')
      await fetch(`/api/records?recordId=${recordId}`, { method: 'PUT', body: JSON.stringify(messageList()), headers: { 'content-type': 'application/json' } })
    } else {
      const r = await fetch('/api/records', { method: 'POST', body: JSON.stringify(messageList()), headers: { 'content-type': 'application/json' } })
      recordId = await r.text()
      localStorage.setItem('recordId', recordId)
    }
  }

  const clear = () => {
    inputRef.value = ''
    inputRef.style.height = 'auto'
    syncRecord().then(() => {
      batch(() => {
        setInputValue('')
        setMessageList([])
        setCurrentError(null)
      })
      localStorage.setItem('messageList', JSON.stringify([]))
      localStorage.removeItem('recordId')
    })
  }

  const stopStreamFetch = () => {
    if (controller()) {
      controller()!.abort()
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
    <div class="flex flex-col flex-grow h-full justify-end">
      <div
        ref={bgd!}
        class="bg-top-center bg-hero-floating-cogs-gray-500/10 h-1000vh w-full translate-y-$scroll transition-opacity top-0 left-0 z--1 duration-1000 fixed op-100 <md:bg-none <md:hiddern"
        class:op-0={!mounted()}
        class:transition-transform={isStick() && loading()}
        class:duration-400={isStick() && loading()}
      />

      <Switch>
        <Match when={selectedPresetId()}>
          <Show when={!((preset() as Preset).hideContext)}>
            <Index each={(preset() as Preset).messages}>
              {message => (
                <MessageItem
                  role={message().role}
                  message={message().content}
                />
              )}
            </Index>
          </Show>
          <div class="flex flex-row h-full gap-4 justify-between items-center">
            <hr class="border-dashed border-$c-fg-10 my-4 w-full" />
            <button class="border-transparent border-y-1 text-xs tracking-wider whitespace-nowrap hover:border-b-$c-fg-30" onClick={() => setSelectedPresetId(null)} type="button">切换课堂</button>
            <hr class="border-dashed border-$c-fg-10 my-4 w-full" />
          </div>
        </Match>
        <Match when={presets()}>
          <div class="grid gap-2 sm:grid-cols-2">
            <For each={Object.entries((presets() as Record<string, Preset>))}>
              {([presetId, { title, messages, examples }]) => (
                <button onClick={() => setSelectedPresetId(presetId)} class="rounded-md flex flex-row py-2 px-2.5 transition-background-color gap-2 whitespace-nowrap overflow-hidden items-center group justify-between !bg-$c-fg-2 hover:!bg-$c-fg-5" type="button">
                  <span>{title}</span>
                  <span class="font-bold font-mono text-xs transition-opacity op-0 group-hover:op-70">{messages.length} + {examples.length}</span>
                </button>
              )}
            </For>
          </div>
          {messageList().length !== 0 && <hr class="border-dashed border-$c-fg-10 my-4 w-full" />}
        </Match>
      </Switch>

      <Index each={messageList()}>
        {(message, index) => (
          <MessageItem
            role={message().role}
            message={message().content}
            showRetry={() => (!loading() && !currentError() && index === messageList().length - 1)}
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

      { currentError() && <ErrorMessageItem data={currentError()!} onRetry={retryLastFetch} /> }

      <Show when={selectedPresetId() && !inputValue() && !loading()}>
        <div class="flex flex-col mt-4 gap-2">

          <For each={(preset() as Preset).examples}>
            {message => (
              <button onClick={() => [setInputValue(message)]} class="rounded-md py-2 px-2.5 transition-background-color gap-2 whitespace-nowrap overflow-hidden !bg-$c-fg-2 hover:!bg-$c-fg-5" type="button">
                {message}
              </button>
            )}

          </For>
        </div>
      </Show>

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
          <div class="gen-text-wrapper">
            <textarea
              ref={inputRef!}
              onKeyDown={handleKeydown}
              placeholder="与 ChatGPT 对话"
              autocomplete="off"
              autofocus
              onInput={(e) => {
                inputRef.style.height = 'auto'
                inputRef.style.height = `${inputRef.scrollHeight}px`
                setInputValue((e.target as HTMLTextAreaElement).value)
              }}
              rows="1"
              class="gen-textarea"
            />
            <button
              title="Send"
              type="button"
              class="w-10 gen-slate-btn sm:min-w-fit sm:px-3.5"
              onClick={handleButtonClick}
            >
              <span class="i-iconamoon-send block sm:hidden" />
              <span class="<sm:hidden">发送</span>
            </button>
            <button title="Clear" type="button" onClick={clear} gen-slate-btn>
              <IconClear />
            </button>
          </div>

        </Match>
      </Switch>

      <TokenCounter
        messageList={fullMessageList}
        textAreaValue={inputValue}
        currentAssistantMessage={currentAssistantMessage}
      />

      <div class="rounded-md h-fit w-fit transition-colors bottom-4.25 left-4.25 z-10 fixed sm:bottom-5 sm:left-5 hover:bg-$c-fg-5 active:scale-90" class:stick-btn-on={isStick()}>
        <button class="text-base p-2.5" title="stick to bottom" type="button" onClick={() => setStick(!isStick())}>
          <div i-ph-arrow-line-down-bold />
        </button>
      </div>
    </div>
  )
}
