import { Index } from 'solid-js'

import { useChat } from '@/context/ChatContext'

import ErrorMessageItem from './ErrorMessageItem'
import MessageItem from './MessageItem'

export default () => {
  const { messageList, currentAssistantMessage, streaming, currentError, retryLastFetch } = useChat()

  return (
    <>
      <Index each={messageList()}>
        {(message, index) => (
          <MessageItem
            role={message().role}
            message={message().content}
            showRetry={() => (!streaming() && !currentError() && !currentAssistantMessage() && index === messageList().length - 1)}
            onRetry={retryLastFetch}
          />
        )}
      </Index>
      {currentAssistantMessage() && (
        <MessageItem
          role="assistant"
          message={currentAssistantMessage}
          incomplete
        />
      )}
      {currentError() && <ErrorMessageItem data={currentError()!} onRetry={retryLastFetch} />}
    </>
  )
}
