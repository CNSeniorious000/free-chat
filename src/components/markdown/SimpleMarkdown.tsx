import type { Component } from 'solid-js'

interface Props {
  text: string
  OverrideCode?: Component<any> | null
  codeProps?: Record<string, any>
  inlineCodeProps?: Record<string, any>
  class?: string
}

// Simple markdown parser for demo purposes
function parseMarkdown(text: string) {
  return {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: text
          }
        ]
      }
    ]
  }
}

export default function SimpleMarkdown({ 
  text, 
  class: className = "markdown-content"
}: Props) {
  return (
    <article class={`max-w-full text-sm prose ${className}`}>
      <div style="white-space: pre-wrap;">
        {text}
      </div>
    </article>
  )
}