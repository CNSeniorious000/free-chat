import type { APIRoute } from 'astro'

import { OPENAI_API_BASE_URL, TRANSCRIPT_BASE_URL, TRANSCRIPT_MODEL, TRANSCRIPT_PROMPT, TRANSCRIPT_TARGET_LANG } from 'astro:env/server'

import { getHeaders } from '@/utils/header'

const baseUrl = (TRANSCRIPT_BASE_URL ?? OPENAI_API_BASE_URL).trim().replace(/\/$/, '')

export const POST: APIRoute = async(context) => {
  const headers = getHeaders(context.request)

  const prompt = '你好。\n\n你好。\n\n你好。\n\n'

  const formData = new FormData()
  formData.append('model', TRANSCRIPT_MODEL)
  formData.append('language', TRANSCRIPT_TARGET_LANG)
  formData.append('response_format', 'text')
  formData.append('prompt', TRANSCRIPT_PROMPT ?? prompt)
  formData.append('file', await context.request.blob(), 'file.webm')

  const text = await fetch(`${baseUrl}/v1/audio/transcriptions`, { method: 'POST', headers, body: formData }).then(res => res.text())

  console.error({ text })

  return new Response(text.trim(), { headers: { 'Content-Type': 'text/plain' } })
}
