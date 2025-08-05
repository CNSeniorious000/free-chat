import { BaseMarkdown } from '../markdown'
import { EnhancedMarkdown } from '../markdown/EnhancedMarkdown'
import CodeBlock from '../CodeBlock'

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
        <h2 class="text-xl font-bold mb-4">Basic Markdown Router</h2>
        <BaseMarkdown text={testMarkdown} />
      </div>
      
      <div>
        <h2 class="text-xl font-bold mb-4">Enhanced Markdown with CodeBlock Integration</h2>
        <EnhancedMarkdown 
          text={testMarkdown} 
          OverrideCode={CodeBlock}
        />
      </div>
    </div>
  )
}