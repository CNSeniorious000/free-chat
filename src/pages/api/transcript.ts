import { getHeaders } from '@/utils/header'
import type { APIRoute } from 'astro'
const baseUrl = ((import.meta.env.OPENAI_API_BASE_URL) || 'https://api.openai.com').trim().replace(/\/$/, '')

export const POST: APIRoute = async(context) => {
  const headers = getHeaders(context.request)

  const prompt = '你好。\n\n你好。\n\n你好。\n\n'

  const formData = new FormData()
  formData.append('model', 'whisper-1')
  formData.append('language', import.meta.env.TRANSCRIPT_TARGET_LANG ?? 'zh')
  formData.append('response_format', 'text')
  formData.append('prompt', import.meta.env.TRANSCRIPT_PROMPT ?? prompt)
  formData.append('file', await context.request.blob(), 'file.webm')

  const text = await fetch(`${baseUrl}/v1/audio/transcriptions`, { method: 'POST', headers, body: formData }).then(res => res.text())

  console.error({ text })

  return new Response(text.trim(), { headers: { 'Content-Type': 'text/plain' } })
}
