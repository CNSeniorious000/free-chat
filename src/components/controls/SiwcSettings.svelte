<script lang="ts">
  import type { ChangeEventHandler } from 'svelte/elements'

  import { onMount } from 'svelte'

  import { requireSiwcResponse, siwcModelKey } from '@/utils/siwc'

  interface Account {
    id: string;
    label: string;
    connected: boolean;
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

  function chooseModel(value: string) {
    model = value
    if (value) localStorage.setItem(siwcModelKey, value)
    else localStorage.removeItem(siwcModelKey)
  }

  const handleModelChange: ChangeEventHandler<HTMLSelectElement> = event => chooseModel(event.currentTarget.value)

  async function refreshAccounts() {
    const status = await requireSiwcResponse(await fetch('/api/siwc', { cache: 'no-store' }))
    const result = await status.json() as { accounts: Account[]; activeAccountId?: string }
    accounts = result.accounts
    activeAccountId = result.activeAccountId
    ready = true
  }

  async function refresh() {
    await refreshAccounts()
    models = []
    if (accounts.some(account => account.id === activeAccountId && account.connected)) {
      const catalog = await requireSiwcResponse(await fetch('/api/siwc/chat', { cache: 'no-store' }))
      models = (await catalog.json()).models
      const saved = localStorage.getItem(siwcModelKey)
      chooseModel(models.find(entry => entry.id === saved)?.id ?? models[0]?.id ?? '')
      if (!models.length) await refreshAccounts()
    }
  }

  async function manage(action: 'login' | 'logout' | 'select', accountId?: string) {
    busy = true
    problem = ''
    try {
      const response = await requireSiwcResponse(await fetch('/api/siwc', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action, accountId }),
      }))
      if (action === 'select' && accountId !== activeAccountId) chooseModel('')
      const result = await response.json()
      if (action === 'login') window.location.assign(result.url)
      else {
        notice = result.revoked === false ? '已在本机退出，远端撤销未确认。请在 ChatGPT 设置中断开此应用。' : ''
        await refresh()
      }
    } catch(error) {
      problem = error instanceof Error ? error.message : 'ChatGPT 账号操作失败。'
    } finally {
      busy = false
    }
  }

  const handleAccountChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const account = accounts.find(entry => entry.id === event.currentTarget.value)
    if (account) void manage(account.connected ? 'select' : 'login', account.id)
  }

  onMount(() => {
    const url = new URL(window.location.href)
    const result = url.searchParams.get('siwc')
    if (result) {
      notice = result === 'connected' ? '已连接 ChatGPT。' : result === 'denied' ? '未授权 ChatGPT 订阅用量。' : 'ChatGPT 登录未完成，请重试。'
      url.searchParams.delete('siwc')
      window.history.replaceState(null, '', url)
    }
    refresh().catch((error) => { problem = error.message }).finally(() => { busy = false })
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
  {#if accounts.length}
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
      <button type="button" class="rounded bg-$c-fg-5 px-2 py-1 hover:bg-$c-fg-10 disabled:op-50" disabled={busy} onclick={() => manage('login')}>添加账号</button>
    {:else}
      <button type="button" data-oai-siwc-button="" class="rounded bg-$c-fg px-2 py-1 text-$c-bg disabled:op-50" disabled={busy} onclick={() => manage('login', activeAccount?.id)}>Continue with ChatGPT</button>
    {/if}
  </div>
{/if}
