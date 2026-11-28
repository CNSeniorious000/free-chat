<script lang="ts">
  import type { ChangeEventHandler } from 'svelte/elements'

  import { onMount } from 'svelte'

  import { isHostedSiwc, requireSiwcResponse, siwcStorageKey } from '@/utils/siwc'

  interface Account {
    id: string;
    label: string;
    connected: boolean;
  }

  interface Device {
    userCode: string;
    interval: number;
    expiresAt: number;
  }

  let accounts = $state<Account[]>([])
  let activeAccountId = $state<string>()
  const activeAccount = $derived(accounts.find(account => account.id === activeAccountId))
  let models = $state<{ id: string; name: string }[]>([])
  let model = $state('')
  let busy = $state(true)
  let ready = $state(false)
  let notice = $state('')
  let problem = $state('')
  let device = $state<Device>()
  const hosted = isHostedSiwc()
  const lifetime = new AbortController()
  let pollTimer: ReturnType<typeof setTimeout> | undefined
  let polling: AbortController | undefined

  function chooseModel(value: string) {
    model = value
    if (value) localStorage.setItem(siwcStorageKey('model'), value)
    else localStorage.removeItem(siwcStorageKey('model'))
  }

  const handleModelChange: ChangeEventHandler<HTMLSelectElement> = event => chooseModel(event.currentTarget.value)

  async function refreshAccounts() {
    const status = await requireSiwcResponse(await fetch('/api/siwc', { cache: 'no-store', signal: lifetime.signal }))
    const result = await status.json() as { accounts: Account[]; activeAccountId?: string }
    if (lifetime.signal.aborted) return
    accounts = result.accounts
    activeAccountId = result.activeAccountId
    ready = true
  }

  async function refresh() {
    await refreshAccounts()
    if (lifetime.signal.aborted) return
    models = []
    if (accounts.some(account => account.id === activeAccountId && account.connected)) {
      const catalog = await requireSiwcResponse(await fetch('/api/siwc/chat', { cache: 'no-store', signal: lifetime.signal }))
      const result = await catalog.json()
      if (lifetime.signal.aborted) return
      models = result.models
      const saved = localStorage.getItem(siwcStorageKey('model'))
      chooseModel(models.find(entry => entry.id === saved)?.id ?? models[0]?.id ?? '')
      if (!models.length) await refreshAccounts()
    }
  }

  async function sendAction(action: 'login' | 'logout' | 'select' | 'poll', accountId?: string, signal = lifetime.signal) {
    return requireSiwcResponse(await fetch('/api/siwc', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action, accountId }),
      signal,
    }))
  }

  function stopPolling() {
    clearTimeout(pollTimer)
    polling?.abort()
    polling = undefined
    device = undefined
  }

  function schedulePoll(challenge: Device, controller: AbortController, interval = challenge.interval) {
    const remaining = Math.max(0, challenge.expiresAt * 1000 - Date.now())
    pollTimer = setTimeout(() => void pollDevice(challenge, controller), Math.min(interval * 1000, remaining))
  }

  async function pollDevice(challenge: Device, controller: AbortController) {
    if (controller.signal.aborted) return
    if (challenge.expiresAt * 1000 <= Date.now()) {
      stopPolling()
      notice = '设备代码已过期，请重试。'
      return
    }

    try {
      const response = await sendAction('poll', undefined, controller.signal)
      const { status } = await response.json()
      if (controller.signal.aborted) return
      if (status === 'pending') {
        schedulePoll(challenge, controller, Math.max(challenge.interval, Number(response.headers.get('retry-after')) || 0))
        return
      }
      device = undefined
      if (status === 'connected') {
        busy = true
        notice = '已连接 ChatGPT。'
        await refresh()
      } else {
        notice = status === 'expired' ? '设备代码已过期，请重试。' : '未获 ChatGPT 授权。'
      }
    } catch(error) {
      if (controller.signal.aborted) return
      device = undefined
      problem = error instanceof Error ? error.message : 'ChatGPT 设备登录失败。'
    } finally {
      if (!controller.signal.aborted && !device) {
        polling = undefined
        busy = false
      }
    }
  }

  async function manage(action: 'login' | 'logout' | 'select', accountId?: string) {
    busy = true
    problem = ''
    if (hosted) notice = ''
    try {
      const response = await sendAction(action, accountId)
      if (lifetime.signal.aborted) return
      if (action === 'select' && accountId !== activeAccountId) {
        activeAccountId = accountId
        models = []
        chooseModel('')
      }
      const result = await response.json()
      if (lifetime.signal.aborted) return
      if (action === 'login') {
        if (hosted) {
          const challenge = result.device as Device
          device = challenge
          polling = new AbortController()
          schedulePoll(challenge, polling)
        } else {
          window.location.assign(result.url)
        }
      } else {
        notice = hosted ? '已断开连接。你也可在 ChatGPT 设置中撤销授权。' : result.revoked === false ? '已在本机退出，远端撤销未确认。请在 ChatGPT 设置中断开此应用。' : ''
        await refresh()
      }
    } catch(error) {
      if (!lifetime.signal.aborted) problem = error instanceof Error ? error.message : 'ChatGPT 账号操作失败。'
    } finally {
      busy = false
    }
  }

  const handleAccountChange: ChangeEventHandler<HTMLSelectElement> = ({ currentTarget }) => {
    const account = accounts.find(entry => entry.id === currentTarget.value)
    currentTarget.value = activeAccountId ?? ''
    if (account) void manage(account.connected ? 'select' : 'login', account.id)
  }

  onMount(() => {
    const url = new URL(window.location.href)
    const result = url.searchParams.get('siwc')
    if (!hosted && result) {
      notice = result === 'connected' ? '已连接 ChatGPT。' : result === 'denied' ? '未授权 ChatGPT 订阅用量。' : 'ChatGPT 登录未完成，请重试。'
      url.searchParams.delete('siwc')
      window.history.replaceState(null, '', url)
    }
    refresh().catch((error) => { if (!lifetime.signal.aborted) problem = error.message }).finally(() => { busy = false })
    return () => {
      lifetime.abort()
      stopPolling()
    }
  })
</script>

<div class="flex flex-wrap items-baseline justify-between gap-2 text-sm">
  <span>{activeAccount?.connected ? '使用 ChatGPT 订阅额度' : '登录后可使用 ChatGPT 订阅额度'}</span>
  <a href="https://chatgpt.com/settings/usage" target="_blank" rel="noreferrer">管理用量</a>
</div>
{#if notice}<p class="text-sm" role="status">{notice}</p>{/if}
{#if problem}<p class="text-sm" role="alert">{problem}</p>{/if}
{#if !ready && busy}<p class="text-sm" role="status">正在读取账号…</p>{/if}
{#if ready}
  {#if !hosted && accounts.length}
    <label class="flex items-center gap-2 text-sm">
      ChatGPT 账号
      <select class="min-w-0 flex-1 rounded bg-$c-fg-5 p-1.5" value={activeAccountId ?? ''} disabled={busy} onchange={handleAccountChange}>
        {#if !activeAccountId}<option value="" disabled>选择账号</option>{/if}
        {#each accounts as account (account.id)}
          <option value={account.id}>{account.label}{account.connected ? '' : ' · 已退出'}</option>
        {/each}
      </select>
    </label>
  {/if}
  {#if models.length}
    <label class="flex items-center gap-2 text-sm">
      模型
      <select class="min-w-0 flex-1 rounded bg-$c-fg-5 p-1.5" value={model} onchange={handleModelChange} disabled={busy}>
        {#each models as entry (entry.id)}
          <option value={entry.id}>{entry.name}</option>
        {/each}
      </select>
    </label>
  {/if}
  <div class="flex flex-wrap gap-2 text-sm">
    {#if activeAccount?.connected}
      <button type="button" class="rounded bg-$c-fg-5 px-2 py-1 hover:bg-$c-fg-10 disabled:op-50" disabled={busy} onclick={() => manage('logout', activeAccount?.id)}>退出</button>
      {#if !hosted}<button type="button" class="rounded bg-$c-fg-5 px-2 py-1 hover:bg-$c-fg-10 disabled:op-50" disabled={busy} onclick={() => manage('login')}>添加账号</button>{/if}
    {:else if device}
      <p class="w-full" role="status">在 OpenAI 输入设备代码：<code class="select-all font-mono">{device.userCode}</code></p>
      <a class="rounded bg-$c-fg px-2 py-1 text-$c-bg" href="https://auth.openai.com/codex/device" target="_blank" rel="noopener noreferrer">打开 OpenAI 验证页</a>
      <button type="button" class="rounded bg-$c-fg-5 px-2 py-1 hover:bg-$c-fg-10" onclick={() => { stopPolling(); void manage('logout') }}>取消</button>
    {:else}
      <button type="button" data-oai-siwc-button="" class="rounded bg-$c-fg px-2 py-1 text-$c-bg disabled:op-50" disabled={busy} onclick={() => manage('login', activeAccount?.id)}>Continue with ChatGPT</button>
    {/if}
  </div>
{/if}
