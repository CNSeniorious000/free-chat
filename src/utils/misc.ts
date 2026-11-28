import { onCleanup } from 'solid-js'

import type { ChatMessage } from '@/types'

import { iterateChat } from './chat-provider'

function isAsyncGeneratorFunction(obj: any): obj is AsyncGeneratorFunction {
  return obj?.constructor?.name === 'AsyncGeneratorFunction'
}

function createAbortSignal() {
  const controller = new AbortController()
  onCleanup(() => controller.abort())
  return controller.signal
}

function retry(times: number) {
  return function(_target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    if (isAsyncGeneratorFunction(originalMethod)) {
      descriptor.value = async function* (...args: any[]) {
        for (let i = 0; i < times; i++) {
          try {
            yield* originalMethod.apply(this, args)
            return
          } catch(error) {
            if (error instanceof Error && error.name === 'AbortError') {
              throw error // AbortError should not be retried
            }
            console.error(`Attempt ${i + 1} failed. Retrying...`, error)
          }
        }
        throw new Error(`Function ${propertyKey} failed after ${times} attempts.`)
      }
    } else {
      descriptor.value = async function(...args: any[]) {
        for (let i = 0; i < times; i++) {
          try {
            return await originalMethod.apply(this, args)
          } catch(error) {
            console.error(`Attempt ${i + 1} failed. Retrying...`, error)
          }
        }
        throw new Error(`Function ${propertyKey} failed after ${times} attempts.`)
      }
    }
    return descriptor
  }
}

class API {
  async* iterateTitle(input: string) {
    let whole = ''
    for await (const delta of iterateChat([{ role: 'user', content: input }], 'title', createAbortSignal())) whole += delta
    const result = JSON.parse(whole.replace(/^\s*```(?:json)?\s*|\s*```\s*$/g, ''))
    if (typeof result?.title === 'string') yield result.title
  }

  async* iterateSuggestion(messages: ChatMessage[]) {
    if (messages.length === 0 || messages.at(-1)?.role === 'user') return

    let whole = ''
    for await (const delta of iterateChat(messages.slice(-8), 'suggest', createAbortSignal())) whole += delta
    const result = JSON.parse(whole.replace(/^\s*```(?:json)?\s*|\s*```\s*$/g, ''))
    if (Array.isArray(result) && result.every(value => typeof value === 'string')) yield result as string[]
  }

  @retry(3)
  async fetchTranslation(input: string) {
    const res = await fetch(`/api/translate?text=${encodeURIComponent(input)}`)
    if (!res.ok) throw new Error(await res.text())
    return res.text()
  }

  @retry(3)
  async fetchModeration(input: string) {
    const res = await fetch('/api/moderate', { method: 'POST', body: input })
    if (!res.ok) throw new Error(await res.text())
    return await res.json() as { flags: string[], category_scores: Record<string, number> }
  }
}

const api = new API()

export const iterateTitle = api.iterateTitle.bind(api)
export const fetchTranslation = api.fetchTranslation.bind(api)
export const fetchModeration = api.fetchModeration.bind(api)
export const iterateSuggestion = api.iterateSuggestion.bind(api)
