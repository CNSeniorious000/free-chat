import { OpenAI } from 'openai'
export const baseUrl = (import.meta.env.OPENAI_API_BASE_URL || 'https://api.openai.com').trim().replace(/\/$/, '')
export const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY ?? '', baseURL: `${baseUrl}/v1`, timeout: 3000 })
