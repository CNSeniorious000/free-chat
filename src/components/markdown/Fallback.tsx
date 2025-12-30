import type { Code, Node, Parent, Root, Text } from 'mdast'

import { toHtml } from 'hast-util-to-html'
import { toHast } from 'mdast-util-to-hast'
import { createMemo, Match, Switch } from 'solid-js'

import LaTeX from './LaTeX'

const isLaTeX = (node: ReturnType<typeof toHast>) => {
  if (node.type === 'element') {
    if (node.tagName === 'code' && (node.properties?.className as string[])?.includes('language-math')) {
      return 'inline'
    } else if (node.tagName === 'pre' && isLaTeX(node.children[0])) {
      return 'block'
    }
  }
  return false
}

export default function Fallback(props: { node: Node }) {
  const hast = createMemo(() => toHast(props.node as Root))
  return (
    <Switch fallback={<div class="contents" innerHTML={toHtml(hast())}></div>}>
      <Match when={isLaTeX(hast()) === 'inline'}>
        <LaTeX value={((hast() as Parent).children as [Code])[0].value} inline={true} />
      </Match>
      <Match when={isLaTeX(hast()) === 'block'}>
        <LaTeX value={(((hast() as Parent).children[0] as Parent).children as [Text])[0].value} inline={false} />
      </Match>
    </Switch>
  )
}
