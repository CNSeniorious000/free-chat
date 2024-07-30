import { OpenAI } from 'openai'
import { openaiBaseUrl } from './constants'
export const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY ?? '', baseURL: openaiBaseUrl, timeout: 10000, maxRetries: 5 })
