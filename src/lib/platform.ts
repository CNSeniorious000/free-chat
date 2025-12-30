import { useChat } from '@/context/ChatContext'

export function isMacOS(): boolean {
  const str = globalThis.navigator?.platform ?? globalThis.navigator?.userAgent ?? useChat().userAgent
  return str ? str.includes('Mac') || str.includes('iPhone') || str.includes('iPad') : false
}
