import { Allow, parse } from 'partial-json'
import { responseToAsyncIterator } from './streaming'
import { promplateBaseUrl } from './constants'
import type { ChatMessage } from '@/types'

function isAsyncGeneratorFunction(obj: any): obj is AsyncGeneratorFunction {
  return obj?.constructor?.name === 'AsyncGeneratorFunction'
}

function retry(times: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    if (isAsyncGeneratorFunction(originalMethod)) {
      descriptor.value = async function *(...args: any[]) {
        for (let i = 0; i < times; i++) {
          try {
            yield * originalMethod.apply(this, args)
            return
          } catch (error) {
            console.error(`Attempt ${i + 1} failed. Retrying...`)
          }
        }
        throw new Error(`Function ${propertyKey} failed after ${times} attempts.`)
      }
    } else {
      descriptor.value = async function(...args: any[]) {
        for (let i = 0; i < times; i++) {
          try {
            return await originalMethod.apply(this, args)
          } catch (error) {
            console.error(`Attempt ${i + 1} failed. Retrying...`)
          }
        }
        throw new Error(`Function ${propertyKey} failed after ${times} attempts.`)
      }
    }
    return descriptor
  }
}

class API {
  @retry(3)
  async *iterateTitle(input: string) {
    const res = await fetch('/api/title-gen', {
      method: 'POST',
      body: input,
      headers: localStorage.getItem('apiKey') ? { authorization: `Bearer ${localStorage.getItem('apiKey')}` } : {},
    })
    if (!res.ok) throw new Error(await res.text())
    let whole = ''
    for await (const delta of responseToAsyncIterator(res)) {
      whole += delta
      const { title }: { title?: string } = parse(whole)
      if (title) yield title
    }
  }

  async *iterateSuggestion(messages: ChatMessage[]) {
    if (messages.length === 0 || messages.at(-1)?.role === 'user') return

    const res = await fetch(`${promplateBaseUrl}/single/suggest`, {
      method: 'PUT',
      body: JSON.stringify({ messages, model: 'gpt-4o-mini' }),
      headers: { 'content-type': 'application/json' },
    })

    let json = ''

    for await (const delta of responseToAsyncIterator(res)) {
      json += delta
      yield parse(json, Allow.ARR) as string[]
    }
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
