import type { Node } from 'mdast'

interface Props {
  node: Node
}

export default function Fallback({ node }: Props) {
  return (
    <div class="fallback">
      {JSON.stringify(node)}
    </div>
  )
}