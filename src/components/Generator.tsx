import type { Setter } from 'solid-js'

import { createEffect, Match, onMount, Show, Switch } from 'solid-js'
import { Toaster } from 'solid-toast'

import { useChat } from '@/context/ChatContext'
import { trackEvent } from '@/utils/track'

import ChatInput from './ChatInput'
import Inview from './Inview'
import MessageList from './MessageList'
import ParallaxBackground from './ParallaxBackground'
import StickToBottomButton from './StickToBottomButton'
import Suggestions from './Suggestions'
import SystemRoleSettings from './SystemRoleSettings'
import Tips from './Tips'
import TokenCounter from './TokenCounter'

export default () => {
  const { inputRef, messageList, currentAssistantMessage, streaming, inputValue, currentSystemRoleSettings, systemRoleEditing, suggestions, suggestionFeatureOn, isStick, mounted, inview, currentError, setSystemRoleEditing, setStick, setCurrentSystemRoleSettings, setInview, clear, deleteLastMessage, stopStreamFetch, resetTextInputHeight } = useChat()
  let rootRef!: HTMLDivElement
  let footer: HTMLElement

  const isHigher = () => {
    const distanceToBottom = footer.offsetTop - window.innerHeight
    const currentScrollHeight = window.scrollY
    return distanceToBottom > currentScrollHeight
  }

  const toBottom = (behavior: 'smooth' | 'instant') => {
    const distanceToBottom = footer.offsetTop - window.innerHeight
    const currentScrollHeight = window.scrollY
    if (distanceToBottom > currentScrollHeight)
      window.scrollTo({ top: distanceToBottom, behavior })
  }

  const smoothToBottom = () => toBottom('smooth')
  const instantToBottom = () => toBottom('instant')

  onMount(() => {
    // This effect should run only after the footer is mounted
    createEffect(() => {
      isStick() && (streaming() ? instantToBottom() : smoothToBottom())
    })

    createEffect(() => {
      // when a new user message is added, scroll to bottom
      if (messageList().at(-1)?.role === 'user') {
        smoothToBottom()
      }
    })

    createEffect(() => {
      // when error occurs in stick-to-bottom mode, scroll to bottom
      if (currentError() && isStick()) {
        instantToBottom()
      }
    })
    // input ref is bound inside ChatInput via setInputRef

    footer = document.querySelector('footer')!

    let lastPosition = window.scrollY

    window.addEventListener('scroll', () => {
      const nowPosition = window.scrollY
      if (nowPosition < lastPosition && isHigher()) setStick(false)
      lastPosition = nowPosition
    })

    window.addEventListener('resize', () => {
      resetTextInputHeight()
      requestAnimationFrame(() => {
        if (isHigher() && isStick()) instantToBottom()
        lastPosition = window.scrollY
      })
    })

    window.addEventListener('keydown', (event) => {
      if ((event.target as HTMLElement).nodeName !== 'TEXTAREA') {
        if (event.code === 'Slash') {
          event.preventDefault()
          const el = inputRef()
          el?.focus()
        } else if (event.code === 'KeyB') {
          trackEvent('stick-to-bottom', { stick: isStick() ? 'switch off' : 'switch on', trigger: 'key' })
          setStick(!isStick())
        }
      }
      if (event.altKey && event.code === 'KeyC') {
        clear()
      }
      if (event.altKey && event.code === 'Backspace') {
        deleteLastMessage()
      }
    }, false)

    createEffect(() => {
      // when message list changes in stick mode and streaming, scroll to bottom instantly
      if (isStick() && streaming()) {
        instantToBottom()
      }
      currentAssistantMessage() // retrigger when changed
    })
  })

  return (
    <main ref={rootRef} class="relative h-full flex flex-grow flex-col justify-between">
      <ParallaxBackground />
      <SystemRoleSettings
        canEdit={() => messageList().length === 0}
        systemRoleEditing={systemRoleEditing}
        setSystemRoleEditing={setSystemRoleEditing}
        currentSystemRoleSettings={currentSystemRoleSettings}
        setCurrentSystemRoleSettings={setCurrentSystemRoleSettings as Setter<string>}
      />
      <div class="w-full flex flex-grow items-center justify-center">
        <Show when={!streaming() && messageList().length === 0 && !systemRoleEditing()}>
          <Tips />
        </Show>
      </div>
      <MessageList />

      <TokenCounter
        currentSystemRoleSettings={currentSystemRoleSettings}
        messageList={messageList}
        textAreaValue={inputValue}
        currentAssistantMessage={currentAssistantMessage}
        hide={!inview() || (suggestionFeatureOn() && !streaming() && !!suggestions().length)}
      />

      <Suggestions />

      <div class="relative sticky bottom-0 px-2rem backdrop-blur-20 -mx-2rem">
        <div class="absolute inset-0 b-t-$c-fg-10 bg-$c-bg op-70 -z-1 <md:transition-background-color" class:b-t-1={!inview()} />
        <Switch>
          <Match when={!mounted()}>
            <div class="gen-cb-wrapper animate-fade-in animate-duration-300">
              <div class="flex flex-row items-center gap-2">
                <span>加载中</span>
                <span i-svg-spinners-6-dots-scale-middle />
              </div>
            </div>
          </Match>
          <Match when={mounted() && streaming()}>
            <div class="gen-cb-wrapper">
              <div class="flex flex-row animate-fade-in animate-duration-300 items-center gap-3">
                <span i-svg-spinners-ring-resize />
                <span>等待响应中</span>
                <div class="gen-cb-stop" onClick={stopStreamFetch}>Stop</div>
              </div>
            </div>
          </Match>
          <Match when={mounted() && !streaming()}>

            <ChatInput />

          </Match>
        </Switch>
      </div>

      <Inview class="invisible absolute bottom-0 left-0 right-0 h-1" setInview={setInview} />

      <StickToBottomButton />

      <Toaster />
    </main>
  )
}
