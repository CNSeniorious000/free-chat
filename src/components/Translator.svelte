<script lang="ts">
  import { onDestroy } from 'svelte'

  import { iterateChat } from '@/utils/chat-provider'

  import UseCopy from './UseCopy.svelte'

  const placeholder = 'type or paste your text here'
  let text = $state('')
  let loading = $state(false)
  let translated = $state('')
  let error = $state('')
  let controller: AbortController | undefined
  const language = 'native English'

  onDestroy(() => controller?.abort())

  async function sync() {
    if (loading || !text.trim()) return
    loading = true
    translated = ''
    error = ''
    controller = new AbortController()
    const { signal } = controller
    try {
      for await (const delta of iterateChat([{ role: 'user', content: text }], 'translate', signal))
        translated += delta
    } catch(cause) {
      if (!signal.aborted)
        error = cause instanceof Error ? cause.message : 'Translation failed'
    } finally {
      loading = false
      controller = undefined
    }
  }
</script>

<header>
  <nav class="mb-5 mt-7 flex flex-row items-center justify-center gap-1.5 tracking-wide">
    <a href="/">Free Chat</a>
    <strong class="from-emerald-200 to-sky-200 bg-(gradient-to-r clip-text) text-transparent">Translator</strong>
    <div class="rounded-lg bg-white/5 px-1.5 py-1 text-xs tracking-wider uppercase">beta</div>
  </nav>
</header>

<div class="m-3 flex flex-col gap-2 md:flex-row">
  <div class="w-full rounded-md bg-white/3 p-2 ring-white/50 transition-all focus-within:(bg-white/7 ring-1.7) lg:p-4 sm:p-3">
    <textarea {placeholder} bind:value={text} class="h-fit min-h-50vh w-full select-none resize-none bg-transparent outline-none md:min-h-80vh placeholder:(text-unset op-30)"></textarea>
    <div class="flex flex-row self-end justify-end gap-3 [&>button:disabled]:op-40">
      <UseCopy {text}>
        {#snippet children({ handleClick, displayText })}
          <button onclick={handleClick} class="not-disabled:(active:scale-95 hover:!ring-white/50 not-focus-visible:!ring-white/10)" disabled={!text}>
            <div class="min-h-4.5 min-w-4.5 flex flex-row items-center justify-center gap-1">
              <div i-iconamoon-copy-duotone></div>
              <span class="text-sm">{displayText}</span>
            </div>
          </button>
        {/snippet}
      </UseCopy>
      <button onclick={sync} class="not-disabled:(active:scale-95 not-focus-visible:bg-$c-fg not-focus-visible:text-$c-bg hover:op-85)" disabled={!text.trim() || loading}>
        <div class="min-h-4.5 min-w-4.5 flex flex-row items-center justify-center gap-1">
          {#if loading}
            <div i-svg-spinners-ring-resize text-xs></div>
            <span class="text-sm">Generating</span>
          {:else}
            <div i-fluent-translate-auto-24-regular></div>
            <span class="text-sm">Translate to {language}</span>
          {/if}
        </div>
      </button>
    </div>
  </div>
  <div class="w-full rounded-md bg-white/3 p-2 lg:p-4 sm:p-3">
    <div class="relative h-full w-full">
      <div class="whitespace-pre-wrap break-words" aria-busy={loading}>
        {#if translated}
          <span class="animate-fade-in animate-duration-200">{translated}</span>
        {:else if !error}
          <span op-30 select-none>translated text will display here</span>
        {/if}
        {#if error}
          <p role="alert">{error}</p>
        {/if}
      </div>
      <div class="absolute bottom-0 right-0 justify-end gap-3 [&>button:disabled]:op-40">
        <UseCopy text={translated}>
          {#snippet children({ handleClick, displayText })}
            <button onclick={handleClick} class="not-disabled:(active:scale-95 hover:!ring-white/50 not-focus-visible:!ring-white/10)" disabled={!translated}>
              <div class="min-h-4.5 min-w-4.5 flex flex-row items-center justify-center gap-1">
                <div i-iconamoon-copy-duotone></div>
                <span class="text-sm">{displayText}</span>
              </div>
            </button>
          {/snippet}
        </UseCopy>
      </div>
    </div>
  </div>
</div>

<style>
  button {
    --uno: rounded-lg py-2 px-2.5 text-$c-fg ring-1.2 ring-$c-fg ring-inset transition-all outline-none;
  }

  ::-webkit-scrollbar {
    --uno: w-1;
  }
  ::-webkit-scrollbar-thumb {
    --uno: rounded-full bg-white/30;
  }
</style>
