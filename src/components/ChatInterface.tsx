import { ChatProvider } from '@/context/ChatContext'

import Generator from './Generator'

export default function ChatInterface() {
  return (
    <ChatProvider>
      <Generator />
    </ChatProvider>
  )
}
