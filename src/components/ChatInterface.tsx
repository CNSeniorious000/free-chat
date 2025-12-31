import { ChatProvider } from '@/context/ChatContext'

import Generator from './Generator'

export default function ChatInterface(props: { userAgent?: string }) {
  return (
    <ChatProvider userAgent={props.userAgent}>
      <Generator />
    </ChatProvider>
  )
}
