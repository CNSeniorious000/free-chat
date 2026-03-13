# CONTEXT KNOWLEDGE BASE

## STRUCTURE

```
src/context/
└── ChatContext.tsx    # Solid.js signals + effects for chat state
```

## WHERE TO LOOK

| Task             | Location        | Notes                              |
| ---------------- | --------------- | ---------------------------------- |
| Message list     | ChatContext.tsx | Solid.js createSignal for messages |
| User input       | ChatContext.tsx | input signal with validation       |
| Streaming        | ChatContext.tsx | createEffect for async streaming   |
| Moderation       | ChatContext.tsx | content moderation logic           |
| Suggestions      | ChatContext.tsx | auto-suggestions for user input    |
| Title generation | ChatContext.tsx | auto-generate chat titles          |
| Token counting   | ChatContext.tsx | token limits/counting logic        |
| Local storage    | ChatContext.tsx | persistence for chat history       |

## CONVENTIONS

### Solid.js Patterns

`createSignal()` 管理响应式状态（messages, input, system role 等），`createEffect()` 处理副作用（moderation, title gen, suggestions），`createMemo()` 计算值（token counts），`onMount()` 初始化逻辑，`onCleanup()` 清理 event listeners 和 abort controllers。

### State Architecture

在单一 context 中集中管理（Solid.js Provider pattern），15+ 个响应式信号管理 UI 状态，localStorage 持久化聊天记录，`requestWithLatestMessage`（70+ 行）包含复杂异步逻辑，token 计数和消息修剪。

## ANTI-PATTERNS

文件过大（508 行）考虑拆分成 hooks，单个文件关注点过多（streaming, moderation, suggestions, title gen）。

## REFACTORING SUGGESTIONS

提取 streaming 逻辑到 `useStreaming.ts` hook，提取 moderation 到 `useModeration.ts` hook，提取 title generation 到 `useTitleGen.ts` hook，提取 suggestions 到 `useSuggestions.ts` hook，拆分大的 `requestWithLatestMessage` 函数。

## NOTES

唯一的 Solid.js 文件（其余都是 Svelte 5），大量使用响应式，Solid.js signals 高效更新，无 TypeScript 错误（类型良好）。
