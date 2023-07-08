export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ErrorMessage {
  code: string
  message: string
}

type Role = 'system' | 'user' | 'assistant'

export interface Message { role: Role, content: string, name?: string | null }

export interface Preset {
  title: string
  messages: Message[]
  examples: string[]
  hideContext: boolean
}
