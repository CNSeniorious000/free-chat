import type { Code } from 'mdast'

interface Props {
  node: Code
  [key: string]: any
}

export default function Pre({ node, ...props }: Props) {
  // Format props to match SolidMarkdown's component interface
  const codeProps = {
    class: node.lang ? `language-${node.lang}` : undefined,
    children: () => node.value,
    inline: false,
    ...props,
  }

  return (
    <pre class="group overflow-hidden">
      <code {...codeProps}>
        {node.value}
      </code>
    </pre>
  )
}
