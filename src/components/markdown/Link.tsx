import type { Link as LinkNode } from 'mdast'
import type { JSX } from 'solid-js'

interface Props {
  node: LinkNode
  children: JSX.Element
}

export default function Link({ node, children }: Props) {
  return (
    <a href={node.url} title={node.title || undefined}>
      {children}
    </a>
  )
}
