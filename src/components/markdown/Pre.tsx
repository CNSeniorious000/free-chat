import type { Code } from 'mdast'

interface Props {
  node: Code
  [key: string]: any
}

export default function Pre({ node, ...props }: Props) {
  return (
    <pre class="code-block" {...props}>
      <code class={node.lang ? `language-${node.lang}` : undefined}>
        {node.value}
      </code>
    </pre>
  )
}