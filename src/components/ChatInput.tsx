import type { Plugin } from 'turndown'

import { createEffect, Match, Show, Switch } from 'solid-js'

import { useChat } from '@/context/ChatContext'
import { isImeComposing } from '@/utils/keyboard'

import IconClear from './icons/Clear'

export default () => {
  const { inputRef, setInputRef, inputValue, setInputValue, handleSubmit, recording, systemRoleEditing, messageList, clear, resetTextInputHeight } = useChat()

  const handleKeydown = (e: KeyboardEvent) => {
    if (isImeComposing(e) || e.shiftKey)
      return

    if (e.key === 'Enter') {
      e.preventDefault()
      inputValue() && handleSubmit()
    }
  }

  // Keep the native textarea value in sync when `inputValue` changes (e.g. selecting a suggestion)
  createEffect(() => {
    const el = inputRef()
    if (!el) return
    el.value = inputValue()
    resetTextInputHeight()
  })

  return (
    <div class="gen-text-wrapper" class:op-50={systemRoleEditing()}>
      <textarea
        ref={setInputRef}
        disabled={systemRoleEditing() || recording() as boolean}
        onKeyDown={handleKeydown}
        onPaste={async(e) => {
          const vscodeEditorData = e.clipboardData?.getData('vscode-editor-data')
          const text = e.clipboardData?.getData('text/plain').replaceAll('\r', '')
          const el = inputRef()
          if (vscodeEditorData && text && el) {
            e.preventDefault()
            const data = JSON.parse(vscodeEditorData)
            const markdown = `\`\`\`${data.mode ?? ''}\n${text}\n\`\`\``
            const index = (el.selectionStart ?? 0) + markdown.length
            // use execCommand to support undo/redo
            document.execCommand('insertText', false, markdown)
            setInputValue(el.value)
            el.setSelectionRange(index, index)
            return
          }
          const html = e.clipboardData?.getData('text/html')
          if (html && el) {
            e.preventDefault()
            const [{ default: TurndownService }, { gfm }] = await Promise.all([
              import('turndown'),
              // @ts-expect-error no types
              import('@joplin/turndown-plugin-gfm') as Promise<{ gfm: Plugin }>,
            ])
            const turndown = new TurndownService({
              headingStyle: 'atx',
              bulletListMarker: '-',
              codeBlockStyle: 'fenced',
              emDelimiter: '_',
              strongDelimiter: '**',
              preformattedCode: true,
            }).use(gfm)
            const markdown = turndown.turndown(html)
            const index = (el.selectionStart ?? 0) + markdown.length
            // use execCommand to support undo/redo
            document.execCommand('insertText', false, markdown)
            setInputValue(el.value)
            el.setSelectionRange(index, index)
          }
        }}
        placeholder={recording() ? (recording() === 'processing' ? '正在转录语音' : '正在录音') : '与 LLM 对话'}
        autocomplete="off"
        enterkeyhint="send"
        onInput={e => setInputValue((e.target as HTMLTextAreaElement).value)}
        rows="1"
        class="gen-textarea"
        data-lenis-prevent
      />
      <button
        title={inputValue() ? 'Send' : 'Record'}
        type="button"
        class="gen-slate-btn w-10"
        onClick={handleSubmit}
        disabled={systemRoleEditing() || recording() === 'processing'}
      >
        <Switch>
          <Match when={inputValue()}>
            <span class="i-iconamoon-send" />
          </Match>
          <Match when={recording() === false}>
            <span class="i-iconamoon-microphone-fill" />
          </Match>
          <Match when={recording() === 'recording'}>
            <span class="i-iconamoon-player-stop-fill" />
          </Match>
          <Match when={recording() === 'processing'}>
            <span class="i-svg-spinners-90-ring-with-bg" />
          </Match>
        </Switch>
      </button>
      <Show when={messageList().length && !inputValue()}>
        <button title="Clear" type="button" onClick={clear} disabled={systemRoleEditing()} gen-slate-btn>
          <IconClear />
        </button>
      </Show>
    </div>
  )
}
