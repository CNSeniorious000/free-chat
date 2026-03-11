import type { ParentComponent, Setter } from 'solid-js'

import { makeEventListener } from '@solid-primitives/event-listener'
import { throttle } from '@solid-primitives/scheduled'
import { PUBLIC_DEFAULT_MODEL, PUBLIC_MAX_TOKENS, PUBLIC_MIN_MESSAGES, PUBLIC_MODERATION_INTERVAL } from 'astro:env/client'
import MarkdownIt from 'markdown-it'
import { batch, createContext, createEffect, createMemo, createSignal, onMount, untrack, useContext } from 'solid-js'
import { toast } from 'solid-toast'

import type { ChatMessage, ErrorMessage } from '@/types'
import type { LocalStorageSetEvent } from '@/utils/events'

import { encoder } from '@/components/TokenCounter'
import { createSmoothStreaming } from '@/hooks/createSmoothStreaming'
import { getStoredApiKey } from '@/utils/auth'
import { promplateBaseUrl as baseUrl } from '@/utils/constants'
import { splitReasoningPart } from '@/utils/deepseek'
import { MessagesEvent } from '@/utils/events'
import { fetchModeration, fetchTranslation, iterateSuggestion, iterateTitle } from '@/utils/misc'
import { audioChunks, getAudioBlob, startRecording, stopRecording } from '@/utils/record'
import { countTokens, tokenCountCache } from '@/utils/tiktoken'
import { trackEvent } from '@/utils/track'

export const minMessages = PUBLIC_MIN_MESSAGES
export const maxTokens = PUBLIC_MAX_TOKENS

interface ChatContextType {
  // Refs
  inputRef: () => HTMLTextAreaElement | undefined
  setInputRef: Setter<HTMLTextAreaElement | undefined>

  // State
  messageList: () => ChatMessage[]
  currentAssistantMessage: () => string
  streaming: () => boolean
  inputValue: () => string
  currentSystemRoleSettings: () => string
  systemRoleEditing: () => boolean
  currentError: () => ErrorMessage | null
  suggestions: () => string[]
  suggestionFeatureOn: () => boolean
  isStick: () => boolean
  recording: () => 'recording' | 'processing' | false
  mounted: () => boolean
  inview: () => boolean
  title: () => string | undefined
  backgroundPattern: () => 'endless' | 'classic'
  md: (markdown: string) => string
  userAgent: string

  // Setters
  setInputValue: Setter<string>
  setSystemRoleEditing: Setter<boolean>
  setStick: (stick: boolean) => boolean
  setCurrentSystemRoleSettings: (role: string) => string
  setInview: Setter<boolean>

  // Actions
  handleSubmit: () => Promise<void>
  clear: () => void
  deleteLastMessage: () => void
  stopStreamFetch: () => void
  retryLastFetch: () => void
  isFieldSizingSupported: boolean
  resetTextInputHeight: () => void
}

const ChatContext = createContext<ChatContextType>()

export const ChatProvider: ParentComponent<{ userAgent?: string }> = (props) => {
  const [inputRef, setInputRef] = createSignal<HTMLTextAreaElement | undefined>(undefined)
  const isFieldSizingSupported = false

  const [currentSystemRoleSettings, _setCurrentSystemRoleSettings] = createSignal('')
  const [systemRoleEditing, setSystemRoleEditing] = createSignal(false)
  const [_messageList, setMessageList] = createSignal<ChatMessage[]>([])
  const [currentError, setCurrentError] = createSignal<ErrorMessage | null>(null)
  const {
    currentAssistantMessage,
    start: startStreaming,
    append: appendStreaming,
    finish: finishStreaming,
    clear: clearStreaming,
  } = createSmoothStreaming({
    onDone: (content) => {
      archiveCurrentMessage(content)
    },
  })
  const [streaming, setStreaming] = createSignal(false)
  const [controller, setController] = createSignal<AbortController | null>(null)
  const [inputValue, setInputValue] = createSignal('')
  const [isStick, _setStick] = createSignal(false)
  const [mounted, setMounted] = createSignal(false)
  const [recording, setRecording] = createSignal<'recording' | 'processing' | false>(false)
  const [suggestions, setSuggestions] = createSignal<string[]>([])
  const [suggestionFeatureOn, setSuggestionFeature] = createSignal(true)
  const [inview, setInview] = createSignal(true)
  const [title, setTitle] = createSignal<string>()
  const [backgroundPattern, setBackgroundPattern] = createSignal<'endless' | 'classic'>('endless')

  const moderationInterval = PUBLIC_MODERATION_INTERVAL

  const messageList = createMemo(() => _messageList().filter(m => typeof m.content === 'string'))

  createEffect(() => currentError() && trackEvent('error', { code: currentError()!.code }))

  const setCurrentSystemRoleSettings = (systemRole: string) => {
    _setCurrentSystemRoleSettings(systemRole) ? localStorage.setItem('systemRoleSettings', systemRole) : localStorage.removeItem('systemRoleSettings')
    return systemRole
  }

  const syncMessageList = () => {
    localStorage.setItem('messageList', JSON.stringify(_messageList()))
  }

  const setStick = (stick: boolean) => {
    _setStick(stick) ? localStorage.setItem('stickToBottom', 'stick') : localStorage.removeItem('stickToBottom')
    return stick
  }

  const resetTextInputHeight = () => {
    // When field-sizing is NOT supported, manually resize
    if (isFieldSizingSupported) return
    const el = inputRef()
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  const messagesWithoutReasoning = createMemo(() => messageList().map((msg) => {
    if (msg.role === 'assistant')
      return { ...msg, content: splitReasoningPart(msg.content)[1] }
    return msg
  }))

  const updateSuggestions = async() => {
    if (messageList().length === 0 || !suggestionFeatureOn()) return
    setSuggestions([])
    for await (const suggestions of iterateSuggestion([...messagesWithoutReasoning()]))
      setSuggestions(suggestions)
  }

  createEffect(() => {
    if (messageList().at(-1)?.role === 'assistant') updateSuggestions()
    else if (messageList().length === 0) setSuggestions([])
  })

  const instance = new MarkdownIt({ html: false })
  const md = (markdown: string) => instance.renderInline(markdown)

  const setPageTitle = (title?: string) => {
    document.title = title ?? 'Endless Chat'
    const titleRef: HTMLSpanElement | null = document.querySelector('span.gpt-title')
    titleRef && (titleRef.innerHTML = title ? md(title!) : 'Endless Chat')
    const subTitleRef: HTMLSpanElement | null = document.querySelector('span.gpt-subtitle')
    subTitleRef?.classList.toggle('hidden', !!title)
    title ? localStorage.setItem('title', title) : localStorage.removeItem('title')
  }

  createEffect(() => {
    mounted() && setPageTitle(title())
  })

  const moderationCache: Record<string, string[]> = {}

  let hasBeenInformed = 0

  const moderate = async(input: string) => {
    if (!input.length) return
    if (!moderationInterval) return
    const flags = moderationCache[input] ?? (await fetchModeration(input)).flags
    moderationCache[input] = flags
    if (!flags.length) return
    toast.error(`${flags.join(', ')} detected!`, { position: 'top-center' })
    if (hasBeenInformed++ <= 2) {
      setTimeout(() => toast.error('现在暂时没有影响，未来可能会强制合规', { position: 'top-center', iconTheme: { primary: 'SandyBrown' } }), 500)
      setTimeout(() => toast.error('如有异议可通过页面下方问题反馈联系我', { position: 'top-center', iconTheme: { primary: 'SandyBrown' } }), 700)
    }
    toast.error(await fetchTranslation(`detect ${flags.join(', ')} which violates our policy`), { position: 'top-center' })
  }

  const throttledModerate = throttle((input: string) => { moderate(input) }, moderationInterval)

  createEffect(() => throttledModerate(currentSystemRoleSettings()))
  createEffect(() => throttledModerate(inputValue()))
  createEffect(() => throttledModerate(currentAssistantMessage()))

  const updatePageTitle = async(input: string) => {
    for await (const title of iterateTitle(input))
      setTitle(title)
  }

  const firstMessage = createMemo(() => messageList()[0]?.content)

  createEffect(() => {
    if (firstMessage() && untrack(() => !title())) {
      updatePageTitle(firstMessage()).catch(console.warn)
    }
  })

  const errorHelper = (e: any) => {
    return toast.error(String(e), { position: 'top-center' })
  }

  const handleSubmit = async() => {
    !inputValue() && trackEvent(`${recording() ? 'end' : 'start'}-record`)

    if (recording()) {
      stopRecording()
      setRecording('processing')
      const blob = await getAudioBlob()
      audioChunks.length = 0

      const res = await fetch('/api/transcript', { body: blob, method: 'POST', headers: { 'Content-Type': 'audio/webm' } })
      const text = await res.text()

      setRecording(false)

      if (!res.ok) {
        errorHelper(`Error processing audio: ${res.statusText}`)
      } else if (text) {
        setInputValue(text)
        handleSubmit()
      }

      return
    }

    setSuggestions([])

    const input = inputValue()

    if (!input) {
      try {
        await startRecording()
        setRecording('recording')
      } catch(e) {
        errorHelper(e)
      }
      return
    }

    moderate(input)

    batch(() => {
      setMessageList([...messageList(), { role: 'user', content: input }])
      setInputValue('')
    })

    // This needs to be handled in the UI component
    // smoothToBottom()
    requestWithLatestMessage()
    syncMessageList()
  }

  const formatTokenCount = (messages: ChatMessage[]) => {
    if (!encoder() || messages.length === 0) return undefined
    const result = countTokens(encoder()!, messages)
    return result ? `<=${Math.ceil(result.total / 1000)}k` : undefined
  }

  const requestWithLatestMessage = async() => {
    setStreaming(true)
    startStreaming()
    setCurrentError(null)
    try {
      const controller = new AbortController()
      setController(controller)
      const requestMessageList = [...messagesWithoutReasoning()]

      let limit = maxTokens

      const systemMsg = currentSystemRoleSettings()
        ? {
            role: 'system',
            content: currentSystemRoleSettings(),
          } as ChatMessage
        : null

      systemMsg && (limit -= countTokens(encoder()!, [systemMsg])!.total)

      while (requestMessageList.length > minMessages && countTokens(encoder()!, requestMessageList)!.total > limit)
        requestMessageList.shift()

      systemMsg && requestMessageList.unshift(systemMsg)

      const headers: Record<string, any> = { 'content-type': 'application/json' }
      const apiKey = getStoredApiKey()
      if (apiKey) headers.authorization = `Bearer ${apiKey}`

      const t = localStorage.getItem('temperature') ?? 'undefined'
      const payload: Record<string, any> = { messages: requestMessageList, temperature: t === 'undefined' ? undefined : JSON.parse(t), model: localStorage.getItem('model') ?? PUBLIC_DEFAULT_MODEL }

      const res = await fetch(`${baseUrl}/single/chat_messages`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        signal: controller.signal,
        headers,
      })
      if (!res.ok) {
        const message = await res.text()
        console.error(message)
        setCurrentError({ code: `${res.status} ${res.statusText}`, message })
        throw new Error('Request failed')
      }

      trackEvent('send', {
        model: payload.model,
        temperature: payload.temperature,
        originalTokenCont: _messageList().length ? formatTokenCount((systemMsg ? [systemMsg, ..._messageList()] : _messageList())) : undefined,
        tokenCount: formatTokenCount(requestMessageList),
      })
      const data = res.body
      if (!data)
        throw new Error('No data')

      const reader = data.getReader()
      const decoder = new TextDecoder('utf-8')

      while (true) {
        const { value, done } = await reader.read()
        if (value) {
          const delta = decoder.decode(value)
          if (delta) {
            appendStreaming(delta)
          }
        }
        if (done) {
          break
        }
      }
    } catch(e) {
      console.error(e)
      setStreaming(false)
      if ((e instanceof Error && e.name === 'AbortError'))
        return
      setCurrentError({ code: e instanceof Error ? e.name : 'FETCH_ERROR', message: e instanceof Error ? e.message : String(e) })
    } finally {
      finishStreaming()
    }
  }

  const archiveCurrentMessage = (content: string) => {
    batch(() => {
      setMessageList([...messageList(), { role: 'assistant', content }])
      setStreaming(false)
      setController(null)
    })
    syncMessageList()
  }

  const clear = () => {
    // Check if we should only clear system message
    if (inputValue() === '' && messageList().length === 0 && currentSystemRoleSettings() !== '') {
      setCurrentSystemRoleSettings('')
      return
    }

    // Always allow clear. If streaming, keep streaming and only clear history
    document.dispatchEvent(new MessagesEvent('clearMessages', messageList().length + Number(Boolean(currentSystemRoleSettings()))))
    const el = inputRef()
    if (el) {
      el.value = ''
      el.style.height = 'auto'
    }
    trackEvent('clear', { totalTokenCount: formatTokenCount(messageList()) })

    tokenCountCache.clear()
    if (streaming()) {
      // Clear history but do not interrupt current streaming
      batch(() => {
        setInputValue('')
        setMessageList([])
        setCurrentError(null)
        setTitle()
      })
      syncMessageList()
    } else {
      // Not streaming: clear everything including streaming state
      batch(() => {
        setInputValue('')
        setMessageList([])
        setCurrentError(null)
        setTitle()
        clearStreaming()
      })
      syncMessageList()
    }
  }

  const deleteLastMessage = () => {
    if (streaming() || !messageList().length) return

    const lastMessage = messageList().pop()!
    tokenCountCache.delete(lastMessage.content)
    setMessageList(messageList())
    syncMessageList()
  }

  const stopStreamFetch = () => controller()?.abort()

  const retryLastFetch = () => {
    // setBgdAnimating(true) // UI concern
    if (messageList().length > 0) {
      trackEvent('retry', { lastMessage: messageList().at(-1)!.role })
      const lastMessage = messageList()[messageList().length - 1]
      if (lastMessage.role === 'assistant')
        setMessageList(messageList().slice(0, -1))

      requestWithLatestMessage()
      syncMessageList()
    }
  }

  const value: ChatContextType = {
    inputRef,
    setInputRef,
    messageList,
    currentAssistantMessage,
    streaming,
    inputValue,
    currentSystemRoleSettings,
    systemRoleEditing,
    currentError,
    suggestions,
    suggestionFeatureOn,
    isStick,
    recording,
    mounted,
    inview,
    title,
    backgroundPattern,
    md,
    userAgent: props.userAgent ?? '',
    setInputValue,
    setSystemRoleEditing,
    setStick,
    setCurrentSystemRoleSettings,
    setInview,
    handleSubmit,
    clear,
    deleteLastMessage,
    stopStreamFetch,
    retryLastFetch,
    isFieldSizingSupported,
    resetTextInputHeight,
  }

  onMount(() => {
    try {
      if (localStorage.getItem('messageList')) {
        const messageListFromStorage = JSON.parse(localStorage.getItem('messageList')!)
        if (messageListFromStorage.length) {
          setMessageList(messageListFromStorage)
          if (localStorage.getItem('title'))
            setTitle(localStorage.getItem('title')!)
        }
      }

      if (localStorage.getItem('stickToBottom') === 'stick')
        setStick(true)

      if (localStorage.getItem('systemRoleSettings'))
        setCurrentSystemRoleSettings(localStorage.getItem('systemRoleSettings') ?? '')
    } catch(err) {
      console.error(err)
    }

    setMounted(true)

    // suggestion feature init and sync with localStorage events
    try {
      const stored = JSON.parse(localStorage.getItem('suggestion') ?? 'true')
      setSuggestionFeature(stored)
    } catch {
      // ignore
    }

    const storedPattern = localStorage.getItem('pattern')
    setBackgroundPattern(storedPattern === 'classic' ? 'classic' : 'endless')

    makeEventListener(document, 'localStorageSet', (event) => {
      const { detail: { key, value } } = event as LocalStorageSetEvent
      if (key === 'suggestion') {
        try {
          setSuggestionFeature(JSON.parse(value) ?? true)
        } catch {
          setSuggestionFeature(true)
        }
      }
      if (key === 'pattern') {
        setBackgroundPattern(value === 'classic' ? 'classic' : 'endless')
      }
    })
  })

  return (
    <ChatContext.Provider value={value}>
      {props.children}
    </ChatContext.Provider>
  )
}

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
