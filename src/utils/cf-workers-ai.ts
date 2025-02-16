import { CF_ACCOUNT_ID, CF_API_TOKEN } from 'astro:env/server'

export async function run(model: string, input: any) {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) throw new Error('cloudflare configuration not found')

  const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${model}`,
      {
        headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
        method: 'POST',
        body: JSON.stringify(input),
      },
  )
  return res.json()
}
