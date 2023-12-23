/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_PROMPLATE_DEMO_BASE_URL: string
  readonly OPENAI_API_KEY: string
  readonly OPENAI_API_BASE_URL: string
  readonly HEAD_SCRIPTS: string
  readonly SECRET_KEY: string
  readonly OPENAI_API_MODEL: string
  readonly PUBLIC_MAX_TOKENS: string
  readonly PUBLIC_MIN_MESSAGES: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
