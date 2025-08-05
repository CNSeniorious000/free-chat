import type { InlineCode as InlineCodeNode } from 'mdast'

interface Props {
  node: InlineCodeNode
  [key: string]: any
}

export default function InlineCode({ node, ...props }: Props) {
  return (
    <code class="inline-code" {...props}>
      {node.value}
    </code>
  )
}
