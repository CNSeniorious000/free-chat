import type { Node, Root } from 'mdast'

import { toHtml } from 'hast-util-to-html'
import { toHast } from 'mdast-util-to-hast'

export default function Fallback(props: { node: Node }) {
  return toHtml(toHast(props.node as Root))
}
