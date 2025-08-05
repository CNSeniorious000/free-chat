# SolidJS Markdown Router

This directory contains a SolidJS implementation of a markdown router similar to the Svelte version from `@promplate/pyth-on-line`. It provides modular, customizable markdown rendering using remark.

## Components

### BaseMarkdown
The main wrapper component that parses markdown text and renders it using the Router.

```tsx
import { BaseMarkdown } from './components/markdown'

<BaseMarkdown 
  text={markdownText}
  OverrideCode={CustomCodeComponent}
  codeProps={{ highlight: true }}
  inlineCodeProps={{ inspect: inspectFunction }}
/>
```

### Router
The core routing component that recursively renders markdown AST nodes.

### EnhancedMarkdown
An enhanced version that provides better integration with the existing codebase, particularly with the CodeBlock component.

```tsx
import { EnhancedMarkdown } from './components/markdown'
import CodeBlock from './CodeBlock'

<EnhancedMarkdown 
  text={content()}
  OverrideCode={CodeBlock}
  class="message relative max-w-full overflow-hidden prose"
/>
```

### Individual Components

- **Fallback**: Handles unknown node types
- **InlineCode**: Renders inline code snippets
- **Link**: Renders markdown links
- **Pre**: Renders code blocks
- **Table**: Renders markdown tables

## Usage

### Basic Usage

```tsx
import { BaseMarkdown } from './components/markdown'

export default function MyComponent() {
  const markdown = `
# Hello World

This is **bold** and this is *italic*.

\`\`\`javascript
console.log('Hello from code block')
\`\`\`
  `

  return <BaseMarkdown text={markdown} />
}
```

### With Custom Code Component

```tsx
import { EnhancedMarkdown } from './components/markdown'
import CodeBlock from './CodeBlock'

export default function ChatMessage({ content }) {
  return (
    <EnhancedMarkdown 
      text={content}
      OverrideCode={CodeBlock}
      class="message prose"
    />
  )
}
```

### Replacing SolidMarkdown

The new router can replace the existing SolidMarkdown usage:

```tsx
// Before
<SolidMarkdown
  remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
  rehypePlugins={[rehypeKatex]}
  class="message relative max-w-full overflow-hidden prose"
  components={{
    code: CodeBlock,
    pre({ children }) {
      return <pre class="group overflow-hidden">{children}</pre>
    },
  }}
>
  {content()}
</SolidMarkdown>

// After
<EnhancedMarkdown 
  text={content()}
  OverrideCode={CodeBlock}
  class="message relative max-w-full overflow-hidden prose"
/>
```

## Features

- ✅ Supports all standard markdown elements
- ✅ GitHub Flavored Markdown (GFM) support
- ✅ Customizable code block rendering
- ✅ Table support
- ✅ Link rendering
- ✅ Fallback for unknown elements
- ✅ TypeScript support
- ✅ Modular architecture
- ✅ CSS styling included

## Dependencies

The router uses these packages which are added to package.json:

- `mdast-util-from-markdown` - Markdown parsing
- `mdast-util-gfm` - GitHub Flavored Markdown support  
- `micromark-extension-gfm` - GFM extensions
- `@types/mdast` - TypeScript types

## Architecture

The implementation follows the same pattern as the Svelte version:

1. **BaseMarkdown** - Entry point, handles parsing
2. **Router** - Core component that routes different node types
3. **Individual components** - Handle specific markdown elements
4. **CSS** - Styling for rendered elements

This provides a clean, modular architecture that's easy to extend and customize.