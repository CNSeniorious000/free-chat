import netlify from '@astrojs/netlify'
import node from '@astrojs/node'
import solidJs from '@astrojs/solid-js'
import svelte, { vitePreprocess } from '@astrojs/svelte'

import vercel from '@astrojs/vercel'
import AstroPWA from '@vite-pwa/astro'
import { defineConfig, envField } from 'astro/config'
import unocss from 'unocss/astro'
import disableBlocks from './plugins/disableBlocks'

const envAdapter = () => {
  switch (process.env.OUTPUT) {
    case 'vercel': return vercel()
    case 'netlify': return netlify()
    default: return node({ mode: 'standalone' })
  }
}

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      PUBLIC_DEFAULT_MODEL: envField.string({ context: 'client', access: 'public', default: 'gpt-4o-mini' }),
      PUBLIC_MIN_MESSAGES: envField.number({ context: 'client', access: 'public', default: 3 }),
      PUBLIC_MAX_TOKENS: envField.number({ context: 'client', access: 'public', default: 3000 }),
      PUBLIC_MODERATION_INTERVAL: envField.number({ context: 'client', access: 'public', default: 2000 }),
      PUBLIC_IFRAME_URL: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_PROMPLATE_DEMO_BASE_URL: envField.string({ context: 'client', access: 'public', default: 'https://demo.promplate.dev' }),
      PUBLIC_RIGHT_ALIGN_MY_MSG: envField.boolean({ context: 'client', access: 'public', default: false }),
      HEAD_SCRIPTS: envField.string({ context: 'client', access: 'public', optional: true }),
      UNDICI_UA: envField.string({ context: 'server', access: 'secret', optional: true }),
      OPENAI_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      TITLE_GEN_MODEL: envField.string({ context: 'server', access: 'secret', optional: true }),
      OPENAI_API_MODEL: envField.string({ context: 'server', access: 'secret' }),
      OPENAI_BASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      OPENAI_API_BASE_URL: envField.string({ context: 'server', access: 'secret', default: 'https://api.openai.com' }),
      TRANSCRIPT_TARGET_LANG: envField.string({ context: 'server', access: 'secret', default: 'zh' }),
      TRANSCRIPT_PROMPT: envField.string({ context: 'server', access: 'secret', optional: true }),
      DEEPL_AUTH_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      DEEPL_API_HOST: envField.string({ context: 'server', access: 'secret', optional: true }),
      TRANSLATE_PROVIDER: envField.enum({ values: ['deepl', 'cf'], context: 'server', access: 'secret', default: 'deepl' }),
      TRANSLATE_TARGET_LANG: envField.string({ context: 'server', access: 'secret', optional: true }),
      CF_ACCOUNT_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      CF_API_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      TUTORIAL_MD_URL: envField.string({ context: 'server', access: 'public', optional: true }),
      PUBLIC_CL100K_BASE_JSON_URL: envField.string({ context: 'client', access: 'public', default: '/cl100k_base.json' }),
      PUBLIC_TIKTOKEN_BG_WASM_URL: envField.string({ context: 'client', access: 'public', default: '/tiktoken_bg.wasm' }),
    },
  },
  integrations: [
    unocss({ injectReset: true }),
    solidJs(),
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      },
      manifest: {
        id: '/',
        name: 'Endless Chat',
        short_name: 'Endless Chat',
        description: 'Chat for free with AI chatbot',
        theme_color: '#212129',
        background_color: '#212129',
        icons: [
          { sizes: '150x150', type: 'image/svg', src: 'icon.svg' },
          { sizes: '512x512', type: 'image/png', src: 'pwa.png' },
          { sizes: '512x512', type: 'image/png', src: 'pwa.png', purpose: 'maskable' },
        ],
      },
      client: {
        installPrompt: true,
        periodicSyncForUpdates: 20,
      },
      devOptions: {
        enabled: true,
      },
    }),
    svelte({ preprocess: vitePreprocess() }),
  ],
  output: 'server',
  adapter: envAdapter(),
  vite: {
    plugins: [(process.env.OUTPUT === 'vercel' || process.env.OUTPUT === 'netlify') && disableBlocks()],
  },
})
