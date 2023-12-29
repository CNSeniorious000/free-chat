/// <reference types="astro/client" />
/// <reference types="svelte" />

interface ImportMetaEnv {
  readonly PUBLIC_PROMPLATE_DEMO_BASE_URL: string
  readonly OPENAI_API_KEY: string
  readonly OPENAI_API_BASE_URL: string
  readonly HEAD_SCRIPTS: string
  readonly SECRET_KEY: string
  readonly PUBLIC_MAX_TOKENS: string
  readonly PUBLIC_MIN_MESSAGES: string
  readonly PUBLIC_DEFAULT_MODEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
