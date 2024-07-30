export const openaiBaseUrl = (import.meta.env.OPENAI_BASE_URL ?? `${(import.meta.env.OPENAI_API_BASE_URL ?? 'https://api.openai.com').trim().replace(/\/$/, '')}/v1`).trim().replace(/\/$/, '')
export const promplateBaseUrl = import.meta.env.PUBLIC_PROMPLATE_DEMO_BASE_URL.replace(/\/$/, '')
