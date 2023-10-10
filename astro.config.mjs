import { defineConfig } from 'astro/config'
import unocss from 'unocss/astro'
import solidJs from '@astrojs/solid-js'
import AstroPWA from '@vite-pwa/astro'

import node from '@astrojs/node'
import vercel from '@astrojs/vercel/serverless'
import netlify from '@astrojs/netlify'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import disableBlocks from './plugins/disableBlocks'

const envAdapter = () => {
  switch (process.env.OUTPUT) {
    case 'vercel': return vercel({ edgeMiddleware: true })
    case 'netlify': return netlify({ edgeMiddleware: true })
    default: return node({ mode: 'standalone' })
  }
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    unocss({ injectReset: true }),
    solidJs(),
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      manifest: {
        id: '/',
        name: 'Free Chat',
        short_name: 'Free Chat',
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
  ],
  output: 'server',
  adapter: envAdapter(),
  vite: {
    plugins: [wasm(), topLevelAwait(), ((process.env.OUTPUT === 'vercel' || process.env.OUTPUT === 'netlify') && disableBlocks())],
  },
})
