import { run } from '../../utils/cf-workers-ai'
import type { APIRoute } from 'astro'

const target_lang = import.meta.env.TRANSLATE_TARGET_LANG ?? 'chinese'

export const post: APIRoute = async(context) => {
  const text = await context.request.text()
  const { result: { translated_text } } = await run('@cf/meta/m2m100-1.2b', { text, target_lang })
  return new Response(translated_text)
}
