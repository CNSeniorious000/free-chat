interface AuthPayload {
  t: number
  m: string
}

export function parsePersistedString(value: string | null) {
  if (value == null) return null

  try {
    const parsed = JSON.parse(value)
    return typeof parsed === 'string' ? parsed : value
  } catch {
    return value
  }
}

export function parseStoredApiKey(value: string | null) {
  const parsed = parsePersistedString(value)

  // Temporary cleanup for users who already ended up with the literal `""` as the API key value.
  // Remove this once the old bad values have been normalized away.
  return parsed === '""' ? '' : parsed
}

export function getStoredApiKey() {
  const storedValue = localStorage.getItem('apiKey')
  const apiKey = parseStoredApiKey(storedValue) ?? ''

  if (apiKey === '' && storedValue !== null && storedValue !== '')
    localStorage.setItem('apiKey', '')

  return apiKey
}

async function digestMessage(message: string) {
  const msgUint8 = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export const generateSignature = async(payload: AuthPayload) => {
  const { t: timestamp, m: lastMessage } = payload
  const secretKey = import.meta.env.PUBLIC_SECRET_KEY as string
  const signText = `${timestamp}:${lastMessage}:${secretKey}`

  return await digestMessage(signText)
}

export const verifySignature = async(payload: AuthPayload, sign: string) => {
  // if (Math.abs(payload.t - Date.now()) > 1000 * 60 * 5) {
  //   return false
  // }
  const payloadSign = await generateSignature(payload)
  return payloadSign === sign
}
