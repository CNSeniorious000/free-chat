import { PUBLIC_PROMPLATE_DEMO_BASE_URL } from 'astro:env/client'

export const promplateBaseUrl = PUBLIC_PROMPLATE_DEMO_BASE_URL.replace(/\/$/, '')
