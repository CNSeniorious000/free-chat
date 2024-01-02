<script lang="ts">
  import { createParser } from 'eventsource-parser'
  import { promplateBaseUrl } from '@/utils/constants'
  import UseCopy from './UseCopy.svelte'

  const placeholder = 'type or paste your text here'
  let text = ''
  let loading = false
  let parsed: { translated: string; original: string }[] = []
  const language = 'native English'
  const headers = { 'Content-Type': 'application/json' }

  async function *streamAsyncIterator(stream: ReadableStream<Uint8Array>) {
    const reader = stream.getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        yield decoder.decode(value)
      }
    } catch (e) {
      console.error('Error reading from stream', e)
    } finally {
      reader.releaseLock()
    }
  }

  async function sync() {
    loading = true
    const parser = createParser((event) => {
      if (event.type !== 'event') return
      if (event.event === 'finish') return (loading = false)
      if (event.event === 'error') {
        console.error(event.data)
        return (loading = false)
      }

      parsed = JSON.parse(event.data)
    })

    const body = await fetch(`${promplateBaseUrl}/stream/translate`, { method: 'POST', body: JSON.stringify({ text, language }), headers }).then(r => r.body)

    for await (const chunk of streamAsyncIterator(body!)) parser.feed(chunk)
  }
</script>

<header>
  <nav class="mb-5 mt-7 flex flex-row items-center justify-center gap-1.5 tracking-wide">
    Free Chat <strong class="from-emerald-200 to-sky-200 bg-(gradient-to-r clip-text) text-transparent">Translator</strong>
    <div class="rounded-lg bg-white/5 px-1.5 py-1 text-xs tracking-wider uppercase">beta</div>
  </nav>
</header>

<div class="m-3 flex flex-col gap-2 md:flex-row">
  <div class="w-full rounded-md bg-white/3 p-2 ring-white/50 transition-all focus-within:(bg-white/7 ring-1.7) lg:p-4 sm:p-3">
    <textarea {placeholder} bind:value={text} class="h-fit min-h-50vh w-full select-none resize-none bg-transparent outline-none md:min-h-80vh placeholder:(text-unset op-30)"></textarea>
    <div class="flex flex-row self-end justify-end gap-3 [&>button:disabled]:op-40">
      <UseCopy {text} let:handleClick let:displayText>
        <button on:click={handleClick} class="not-disabled:(active:scale-95 hover:!ring-white/50 not-focus-visible:!ring-white/10)" disabled={!text}>
          <div class="min-h-4.5 min-w-4.5 flex flex-row items-center justify-center gap-1">
            <div i-iconamoon-copy-duotone></div>
            <span class="text-sm">{displayText}</span>
          </div>
        </button>
      </UseCopy>
      <button on:click={sync} class="not-disabled:(active:scale-95 not-focus-visible:bg-$c-fg not-focus-visible:text-$c-bg hover:op-85)" disabled={!text || loading}>
        <div class="min-h-4.5 min-w-4.5 flex flex-row items-center justify-center gap-1">
          {#if loading}
            <div i-svg-spinners-ring-resize text-xs />
            <span class="text-sm">Generating</span>
          {:else}
            <div i-fluent-translate-auto-24-regular />
            <span class="text-sm">Translate to {language}</span>
          {/if}
        </div>
      </button>
    </div>
  </div>
  <div class="w-full rounded-md bg-white/3 p-2 lg:p-4 sm:p-3">
    <div class="relative h-full w-full">
      <div whitespace-pre-line>
        {#each parsed as { translated }}
          {#if translated}
            <span class="animate-fade-in animate-duration-200"> {translated} </span>
          {/if}
        {:else}
          <span op-30 select-none>translated text will display here</span>
        {/each}
      </div>
      <div class="absolute bottom-0 right-0 justify-end gap-3 [&>button:disabled]:op-40">
        <UseCopy text={parsed.reduce((acc, { translated }) => acc + translated ?? '', '')} let:handleClick let:displayText>
          <button on:click={handleClick} class="not-disabled:(active:scale-95 hover:!ring-white/50 not-focus-visible:!ring-white/10)" disabled={!parsed.length}>
            <div class="min-h-4.5 min-w-4.5 flex flex-row items-center justify-center gap-1">
              <div i-iconamoon-copy-duotone></div>
              <span class="text-sm">{displayText}</span>
            </div>
          </button>
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
