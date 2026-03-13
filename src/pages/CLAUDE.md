# PAGES KNOWLEDGE BASE

## STRUCTURE

```
src/pages/
├── index.astro          # main chat interface (homepage)
├── tutorial/index.astro  # tutorial/documentation page
├── beta/translate.astro # translation tool (beta feature)
├── password.astro       # password-protected access
└── api/                # API endpoints (see api/AGENTS.md)
```

## WHERE TO LOOK

| Task             | Location             | Notes                                            |
| ---------------- | -------------------- | ------------------------------------------------ |
| Main chat        | index.astro          | entry point, ChatInterface + Header + Footer     |
| Tutorial         | tutorial/index.astro | Reveal.js integration for markdown presentations |
| Translation tool | beta/translate.astro | Svelte component hydration                       |
| Auth             | password.astro       | client-side password validation                  |

## CONVENTIONS

### Astro Page Structure

Frontmatter script (---) 用于服务端逻辑，从 src/ 导入组件，`client:load` 用于 Svelte 组件水合，基于 Cookie 检测主题（Astro.cookies），inline `<script>` 用于客户端逻辑（Lenis smooth scrolling），`Astro.request.headers` 检测 user-agent，`Astro.cookies` 用于主题/auth 状态。

### SSR Patterns

Frontmatter 中服务端数据获取，环境变量通过 `import.meta.env`，cookie 状态作为 props 传递给水合组件。

## NOTES

index.astro 有全局 CSS 变量用于主题（--c-fg-2, --c-fg-5 等），Lenis 平滑滚动用 requestAnimationFrame，PageUp/PageDown 键盘导航。
