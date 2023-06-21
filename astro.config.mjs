import { defineConfig } from 'astro/config'
import unocss from 'unocss/astro'
import solidJs from '@astrojs/solid-js'
import AstroPWA from '@vite-pwa/astro'

import node from '@astrojs/node'
import vercel from '@astrojs/vercel/edge'
import netlify from '@astrojs/netlify/edge-functions'
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
    unocss(),
    solidJs(),
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Free Chat - ChatGPT',
        short_name: 'Free Chat',
        description: 'Chat with ChatGPT For Free',
        theme_color: '#212129',
        background_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon.svg',
            sizes: '32x32',
            type: 'image/svg',
            purpose: 'any maskable',
          },
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
    plugins: (process.env.OUTPUT === 'vercel' || process.env.OUTPUT === 'netlify') ? [disableBlocks()] : [],
  },
})
