/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly OPENAI_API_KEY: string
  readonly HTTPS_PROXY: string
  readonly OPENAI_API_BASE_URL: string
  readonly HEAD_SCRIPTS: string
  readonly SECRET_KEY: string
  readonly SITE_PASSWORD: string
  readonly OPENAI_API_MODEL: string
readonly OPENAI_API_TEMPERATURE: string
readonly TUTORIAL_MD_URL: string
readonly PUBLIC_IFRAME_URL: string
readonly UNDICI_UA: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
