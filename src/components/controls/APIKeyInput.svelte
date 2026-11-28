<script lang="ts">
  import { persistedState } from 'svelte-persisted-state'

  import { parseStoredApiKey } from '@/utils/auth'

  const apiKey = persistedState('apiKey', '', {
    serializer: {
      parse: value => parseStoredApiKey(value) ?? '',
      stringify: value => value,
    },
  })
</script>

<input bind:value={apiKey.current} type="text" placeholder="sk-******** / sess-********" class="w-full rounded bg-$c-fg-5 px-1.5 py-1 font-light font-mono outline-none transition-background-color focus:bg-$c-fg-10 placeholder:text-$c-fg-30" />
