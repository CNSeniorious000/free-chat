import type { Node } from 'mdast'
import type { Component } from 'solid-js'

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

function parseWithRemarkPlugins(text: string): Node {
  // For now, use basic parsing, but this could be enhanced to use remark plugins
  return fromMarkdown(text, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  })
}

export default function EnhancedMarkdown({
  text,
  OverrideCode = null,
  codeProps = {},
  inlineCodeProps = {},
  class: className = 'message relative max-w-full overflow-hidden prose',
}: Props) {
  const ast = () => parseWithRemarkPlugins(text)

  return (
    <div class={className}>
      <Router
        node={ast()}
        OverrideCode={OverrideCode}
        codeProps={codeProps}
        inlineCodeProps={inlineCodeProps}
      />
    </div>
  )
}
