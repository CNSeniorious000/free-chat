<script lang="ts">
  import type { ChangeEventHandler } from 'svelte/elements'

  import { onMount } from 'svelte'

  import type { ChatProviderInfo } from '@/utils/chat-provider'

  import { getChatProvider, getChatSelection, setChatSelection } from '@/utils/chat-provider'
  import { trackEvent } from '@/utils/track'

  import BackgroundSelector from './controls/BackgroundSelector.svelte'
  import Group from './controls/Group.svelte'
  import Section from './controls/Section.svelte'
  import Slider from './controls/Slider.svelte'
  import Toggle from './controls/Toggle.svelte'
  import Modal from './Modal.svelte'

  interface Props {
    show: boolean;
  }

  let { show = $bindable() }: Props = $props()

  let previousFocus = $state<HTMLElement | null>()
  let provider = $state<ChatProviderInfo>()
  let accounts = $state<{ accounts: { id: string; label: string; connected: boolean }[]; activeAccountId?: string }>()
  const currentAccount = $derived(accounts?.accounts.find(account => account.id === accounts?.activeAccountId))
  let selectedModel = $state('')
  let busy = $state(false)
  let loading = $state(false)
  let notice = $state('')
  let problem = $state('')
  let refreshProblem = $state('')
  const providerProblem = $derived(refreshProblem || provider?.error?.message)

  function chooseModel(model: string) {
    selectedModel = model
    if (provider) setChatSelection(provider.provider, model.trim())
  }

  const handleModelChange: ChangeEventHandler<HTMLSelectElement | HTMLInputElement> = event => chooseModel(event.currentTarget.value)

  async function refreshProvider() {
    loading = true
    refreshProblem = ''
    try {
      const info = await getChatProvider()
      provider = info
      const selection = getChatSelection()
      const models = info.models ?? []
      const savedModel = selection?.provider === info.provider ? selection.model : undefined
      if (info.provider === 'siwc') {
        const response = await fetch('/api/siwc', { cache: 'no-store' })
        if (!response.ok) {
          accounts = undefined
          refreshProblem = '无法读取 ChatGPT 账号。'
          return
        }
        accounts = await response.json()
        if (models.length) chooseModel(models.find(model => model.id === savedModel)?.id ?? models[0].id)
      } else {
        chooseModel(savedModel || models[0]?.id || '')
      }
    } catch {
      refreshProblem = '无法读取模型供应商配置。'
    } finally {
      loading = false
    }
  }

  async function manageAccount(action: 'login' | 'logout' | 'select', accountId?: string) {
    busy = true
    notice = ''
    problem = ''
    try {
      const response = await fetch('/api/siwc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action, accountId }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error?.message ?? '账号操作失败。')
      if (action === 'login') window.location.assign(result.url)
      else {
        if (result.revoked === false) notice = '已在本机退出，远端撤销未确认。请在 ChatGPT 设置中断开此应用。'
        await refreshProvider()
      }
    } catch(error) {
      problem = error instanceof Error ? error.message : '账号操作失败。'
    } finally {
      busy = false
    }
  }

  const handleAccountChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const account = accounts?.accounts.find(entry => entry.id === event.currentTarget.value)
    if (account) void manageAccount(account.connected ? 'select' : 'login', account.id)
  }

  onMount(() => {
    const url = new URL(window.location.href)
    const result = url.searchParams.get('siwc')
    if (!result) return
    url.searchParams.delete('siwc')
    window.history.replaceState(null, '', url)
    show = true
    if (result === 'connected') notice = '已连接 ChatGPT。此应用的生成请求使用你的订阅额度。'
    else problem = result === 'denied' ? '未授权 ChatGPT 订阅用量。' : 'ChatGPT 登录未完成，请重试。'
  })

  function handleKeydown({ altKey, code }: KeyboardEvent) {
    if (altKey && code === 'KeyO')
      show = !show
  }

  $effect(() => {
    if (show) {
      previousFocus = document.activeElement as HTMLElement | null
      trackEvent('open-settings')
      void refreshProvider()
    } else {
      previousFocus?.focus()
    }
  })
</script>

<svelte:window onkeydown={handleKeydown} />

<Modal bind:show icon="i-fluent-emoji-flat-eight-pointed-star">
  {#snippet inside()}
    <div class="i-fluent-thumb-like-24-filled text-lg"></div>
  {/snippet}
  <div class="w-full flex flex-col gap-5 -translate-y-3">
    <div class="hidden sm:inline">
      <Section title="背景图形">
        <BackgroundSelector />
      </Section>
    </div>

    <Section title="模型供应商">
      {#if loading}
        <p class="text-sm" role="status">正在读取供应商配置…</p>
      {/if}
      {#if providerProblem}
        <p class="text-sm" role="alert">{providerProblem}</p>
      {/if}
      {#if problem}
        <p class="text-sm" role="alert">{problem}</p>
      {/if}
      {#if notice}
        <p class="text-sm" role="status">{notice}</p>
      {/if}
      {#if provider?.provider === 'siwc'}
        <div class="flex flex-wrap items-baseline justify-between gap-2 text-sm">
          <span>{currentAccount?.connected ? '使用 ChatGPT 订阅额度' : 'ChatGPT 订阅'}</span>
          <a href="https://chatgpt.com/settings/usage" target="_blank" rel="noreferrer">管理用量</a>
        </div>
        {#if accounts}
          {#if accounts.accounts.length}
            <label class="flex items-center gap-2 text-sm">
              ChatGPT 账号
              <select class="min-w-0 flex-1 rounded bg-$c-fg-5 p-1.5" value={accounts.activeAccountId ?? ''} disabled={busy || loading} onchange={handleAccountChange}>
                {#if !accounts.activeAccountId}<option value="" disabled>选择账号</option>{/if}
                {#each accounts.accounts as account (account.id)}
                  <option value={account.id}>{account.label}{account.connected ? '' : ' · 已退出'}</option>
                {/each}
              </select>
            </label>
          {/if}
          {#if provider.models?.length}
            <label class="flex items-center gap-2 text-sm">
              模型
              <select class="min-w-0 flex-1 rounded bg-$c-fg-5 p-1.5" value={selectedModel} onchange={handleModelChange} disabled={busy || loading}>
                {#each provider.models as model (model.id)}
                  <option value={model.id}>{model.name}</option>
                {/each}
              </select>
            </label>
          {/if}
          <div class="flex flex-wrap gap-2 text-sm">
            {#if currentAccount?.connected}
              <button type="button" class="rounded bg-$c-fg-5 px-2 py-1 hover:bg-$c-fg-10 disabled:op-50" disabled={busy || loading} onclick={() => manageAccount('logout', currentAccount?.id)}>退出</button>
            {:else}
              <button type="button" class="rounded bg-$c-fg px-2 py-1 text-$c-bg disabled:op-50" disabled={busy || loading} onclick={() => manageAccount('login', currentAccount?.id)}>Continue with ChatGPT</button>
            {/if}
            {#if currentAccount}
              <button type="button" class="rounded bg-$c-fg-5 px-2 py-1 hover:bg-$c-fg-10 disabled:op-50" disabled={busy || loading} onclick={() => manageAccount('login')}>添加账号</button>
            {/if}
          </div>
        {/if}
      {:else if provider?.provider === 'preview-fixture' && !provider.error}
        <p class="text-sm">Vercel Preview · 模拟回复，不调用真实模型</p>
      {:else if provider?.provider === 'openai-compatible' && !provider.error}
        <p class="text-sm">OpenAI-compatible</p>
        <label class="flex items-center gap-2 text-sm">
          模型
          <input class="min-w-0 flex-1 rounded bg-$c-fg-5 p-1.5" type="text" value={selectedModel} placeholder={provider.models?.[0]?.id} onchange={handleModelChange} />
        </label>
        <Group title="Temperature">
          <Slider key="temperature" initial={undefined} />
        </Group>
      {/if}
    </Section>

    <Section title="偏好">
      <Group title="自动回复推荐">
        <Toggle key="suggestion" />
      </Group>
    </Section>
  </div>
</Modal>
