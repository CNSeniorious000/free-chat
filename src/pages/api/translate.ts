import { run } from '../../utils/cf-workers-ai'
import type { APIRoute } from 'astro'

const deeplAuthKey = import.meta.env.DEEPL_AUTH_TOKEN
const useDeepL = deeplAuthKey && import.meta.env.TRANSLATE_PROVIDER !== 'cf'
const target_lang = import.meta.env.TRANSLATE_TARGET_LANG ?? (useDeepL ? 'ZH' : 'chinese')

export const get: APIRoute = async(context) => {
  const text = context.url.searchParams.get('text')
  if (useDeepL) {
    const host = import.meta.env.DEEPL_API_HOST ?? (deeplAuthKey.endsWith(':fx') ? 'api-free.deepl.com' : 'api.deepl.com')
    const headers = { 'Authorization': `DeepL-Auth-Key ${deeplAuthKey}`, 'Content-Type': 'application/json' }
    const { translations: [{ text: translated_text, detected_source_language }] } = await fetch(`https://${host}/v2/translate`, { method: 'POST', headers, body: JSON.stringify({ text: [text], target_lang }) }).then(res => res.json())
    return new Response(translated_text, { headers: { 'x-detected-source-language': detected_source_language } })
  }
  const { result: { translated_text } } = await run('@cf/meta/m2m100-1.2b', { text, target_lang })
  return new Response(translated_text)
}
