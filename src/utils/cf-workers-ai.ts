export async function run(model: string, input: any) {
  if (!import.meta.env.CF_ACCOUNT_ID || !import.meta.env.CF_API_TOKEN) throw new Error('cloudflare configuration not found')

  const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${import.meta.env.CF_ACCOUNT_ID}/ai/run/${model}`,
      {
        headers: { Authorization: `Bearer ${import.meta.env.CF_API_TOKEN}` },
        method: 'POST',
        body: JSON.stringify(input),
      },
  )
  return res.json()
}
