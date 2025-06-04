import { OPENAI_API_BASE_URL, OPENAI_API_KEY, OPENAI_BASE_URL } from 'astro:env/server'
import { createFetch } from 'xsfetch'

const openaiBaseUrl = (OPENAI_BASE_URL ?? `${OPENAI_API_BASE_URL.trim().replace(/\/$/, '')}/v1`).trim().replace(/\/$/, '')

export const openaiApiParams = { apiKey: OPENAI_API_KEY ?? '', baseURL: openaiBaseUrl, fetch: createFetch({ retry: 5, debug: true }) }
