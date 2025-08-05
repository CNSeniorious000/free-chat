import type { Component } from 'solid-js'
import type { Node } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { gfm } from 'micromark-extension-gfm'

import Router from './Router'

interface Props {
  text: string
  OverrideCode?: Component<any> | null
  codeProps?: Record<string, any>
  inlineCodeProps?: Record<string, any>
  class?: string
}

function parse(text: string): Node {
  return fromMarkdown(text, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  })
}

export default function BaseMarkdown({ 
  text, 
  OverrideCode = null, 
  codeProps = {}, 
  inlineCodeProps = {},
  class: className = "markdown-content"
}: Props) {
  const ast = () => parse(text)

  return (
    <article class={`max-w-full text-sm prose ${className}`}>
      <Router 
        node={ast()} 
        OverrideCode={OverrideCode} 
        codeProps={codeProps} 
        inlineCodeProps={inlineCodeProps} 
      />
    </article>
  )
}