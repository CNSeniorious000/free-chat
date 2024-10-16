import { defineConfig } from 'astro/config'
import unocss from 'unocss/astro'
import solidJs from '@astrojs/solid-js'
import AstroPWA from '@vite-pwa/astro'

import node from '@astrojs/node'
import vercel from '@astrojs/vercel/serverless'
import netlify from '@astrojs/netlify/functions'
import svelte, { vitePreprocess } from '@astrojs/svelte'
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
