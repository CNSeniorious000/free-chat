// Mock SolidMarkdown for testing purposes
import type { Component, JSX } from 'solid-js'

export interface SolidMarkdownComponents {
  code?: Component<any>
  pre?: Component<any>
  // Add other components as needed
}

interface SolidMarkdownProps {
  remarkPlugins?: any[]
  rehypePlugins?: any[]
  class?: string
  components?: SolidMarkdownComponents
  children: string | (() => string)
}

export function SolidMarkdown(props: SolidMarkdownProps): JSX.Element {
  const content = typeof props.children === 'function' ? props.children() : props.children

  // Simple fallback that just renders the text
  return (
    <div class={props.class} style="white-space: pre-wrap;">
      {content}
    </div>
  )
}
