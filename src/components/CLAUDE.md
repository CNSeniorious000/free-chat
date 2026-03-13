# COMPONENTS KNOWLEDGE BASE

## STRUCTURE

```
src/components/
├── controls/        # form controls (ModelSelector, Slider, Toggle, etc.)
├── icons/          # icon components (4 files)
├── ChatInterface/   # TSX chat components
├── [UI].svelte     # direct UI components
└── [UI].astro       # Astro components (Popup, BackTop)
```

## WHERE TO LOOK

| Task              | Location                              | Notes                                      |
| ----------------- | ------------------------------------- | ------------------------------------------ |
| Chat UI           | ChatInterface/                        | TSX for complex chat logic                 |
| Form controls     | controls/                             | ModelSelector, Slider, Toggle, APIKeyInput |
| Modal dialogs     | Modal.svelte, Sponsorship.svelte      | Svelte 5 with $bindable props              |
| Theme toggling    | Themetoggle.svelte, ThemeColor.svelte | $state + $effect for theming               |
| Copy-to-clipboard | UseCopy.svelte                        | utility component                          |

## CONVENTIONS

### Svelte 5 Runes

`$props()` 用解构 props，`$bindable()` + `$props()` 做双向绑定用于 modal `show` props，`$state()` 管理本地状态（UI flags, element refs, form data），`$derived()` 计算值（radius calculations），`$effect()` 处理副作用（focus management, modal transitions, theme changes），ESLint 强制双引号。

### Component Patterns

所有 Svelte 文件用 `<script lang="ts">`，element refs 通过 `$state<Element>()`，modal 组件用 `$effect()` 恢复焦点，loading states 用 $state（showModal, pngReady, svgReady 等），响应式状态和命令式 DOM 操作清晰分离。

## ANTI-PATTERNS

Svelte 组件不要用 client directives（Astro only），避免 props/state 用 TypeScript `any` 类型，不要 inline styles，用 UnoCSS classes。

## NOTES

Chat 组件（ChatInput, MessageItem, ParallaxBackground）是 TSX 不是 Svelte，Solid.js 组件也在这个目录下（ChatInterface 子文件夹）。
