import SimpleMarkdown from '../markdown/SimpleMarkdown.tsx'

export default function MarkdownTest() {
  const testMarkdown = `# Hello World

This is a **bold** text and this is *italic*.

Here's some inline code: \`console.log('hello')\`

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

- List item 1
- List item 2
- List item 3

1. Ordered item 1
2. Ordered item 2

[Link to example](https://example.com)

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

> This is a blockquote
`

  return (
    <div class="p-4 space-y-8">
      <div>
        <h2 class="mb-4 text-xl font-bold">Simple Markdown Display</h2>
        <SimpleMarkdown text={testMarkdown} />
      </div>

      <div>
        <h2 class="mb-4 text-xl font-bold">Markdown Router Implementation</h2>
        <p>The markdown router components have been implemented with the following architecture:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Router.tsx</strong> - Main routing component for markdown AST nodes</li>
          <li><strong>BaseMarkdown.tsx</strong> - Entry point with markdown parsing</li>
          <li><strong>Supporting components</strong> - InlineCode, Link, Pre, Table, Fallback</li>
          <li><strong>EnhancedMarkdown.tsx</strong> - Integration with existing CodeBlock</li>
        </ul>
        <p class="mt-4">The implementation follows the same pattern as the Svelte version from promplate/pyth-on-line.</p>
      </div>
    </div>
  )
}
