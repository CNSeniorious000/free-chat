export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ErrorMessage {
  code: string
  message: string
}

export type ChatProvider = 'siwc' | 'openai-compatible' | 'preview-fixture'
export type ChatPurpose = 'chat' | 'suggest' | 'title' | 'translate'

export interface ChatModelSelection {
  provider: ChatProvider
  model: string
}
