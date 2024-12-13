import { OPENAI_API_BASE_URL, OPENAI_API_KEY, OPENAI_BASE_URL } from 'astro:env/server'

import { OpenAI } from 'openai'

const openaiBaseUrl = (OPENAI_BASE_URL ?? `${OPENAI_API_BASE_URL.trim().replace(/\/$/, '')}/v1`).trim().replace(/\/$/, '')

export const openai = new OpenAI({ apiKey: OPENAI_API_KEY ?? '', baseURL: openaiBaseUrl, timeout: 10000, maxRetries: 5 })
