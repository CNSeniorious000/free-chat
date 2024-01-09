function retry(times: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
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
    return descriptor
  }
}

class API {
  @retry(3)
  async fetchTitle(input: string) {
    const res = await fetch('/api/title-gen', {
      method: 'POST',
      body: input,
      headers: localStorage.getItem('apiKey') ? { authorization: `Bearer ${localStorage.getItem('apiKey')}` } : {},
    })
    if (!res.ok) throw new Error(await res.text())
    return await res.text() as string
  }

  @retry(3)
  async fetchTranslation(input: string) {
    const res = await fetch(`/api/translate?text=${encodeURIComponent(input)}`)
    if (!res.ok) throw new Error(await res.text())
    return await res.text() as string
  }

  @retry(3)
  async fetchModeration(input: string) {
    const res = await fetch('/api/moderate', { method: 'POST', body: input })
    if (!res.ok) throw new Error(await res.text())
    return await res.json() as { flags: string[], category_scores: Record<string, number> }
  }
}

const api = new API()

export const fetchTitle = api.fetchTitle.bind(api)
export const fetchTranslation = api.fetchTranslation.bind(api)
export const fetchModeration = api.fetchModeration.bind(api)
