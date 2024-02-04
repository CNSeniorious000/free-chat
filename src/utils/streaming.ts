export async function *responseToAsyncIterator(response: Response): AsyncGenerator<string, void, undefined> {
  const { body } = response
  if (!body) throw new Error('No data')
  const reader = body.getReader()

  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done)
        break

      yield decoder.decode(value, { stream: true })
    }
  } finally {
    reader.releaseLock()
  }
}
