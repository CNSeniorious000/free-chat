import type { Node, Parent, Root, Text } from 'mdast'

import { toHtml } from 'hast-util-to-html'
import { toHast } from 'mdast-util-to-hast'
import { createMemo, Show } from 'solid-js'

import LaTeX from './LaTeX'

const isLaTeX = (node: ReturnType<typeof toHast>) => {
  return node.type === 'element' && node.tagName === 'code' && (node.properties?.className as string[])?.includes('math-inline')
}

export default function Fallback(props: { node: Node }) {
  const hast = createMemo(() => toHast(props.node as Root))
  return (
    <Show when={isLaTeX(hast())} fallback={<div class="contents" innerHTML={toHtml(hast())}></div>}>
      <LaTeX value={((hast() as Parent).children as [Text])[0].value} inline={true} />
    </Show>
  )
}
