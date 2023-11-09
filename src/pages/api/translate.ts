import { Translator } from 'deepl-node'
import { run } from '../../utils/cf-workers-ai'
import type { TargetLanguageCode } from 'deepl-node'
import type { APIRoute } from 'astro'

const deeplAuthKey = import.meta.env.DEEPL_AUTH_TOKEN
const useDeepL = deeplAuthKey && import.meta.env.TRANSLATE_PROVIDER !== 'cf'
const target_lang = import.meta.env.TRANSLATE_TARGET_LANG ?? (useDeepL ? 'zh' : 'chinese')

export const post: APIRoute = async(context) => {
  if (useDeepL) {
    const translator = new Translator(deeplAuthKey)
    const result = await translator.translateText(await context.request.text(), null, target_lang as TargetLanguageCode)
    return new Response(result.text, { headers: { 'x-detected-language': result.detectedSourceLang } })
  }
  const text = await context.request.text()
  const { result: { translated_text } } = await run('@cf/meta/m2m100-1.2b', { text, target_lang })
  return new Response(translated_text)
}
