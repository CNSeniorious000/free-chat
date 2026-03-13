# Architecture Overview

This is a modern chat application built with Astro as the meta-framework, utilizing a multi-framework architecture with Svelte 5 and Solid.js components.

## Framework Integration

- Astro: Main framework providing server-side rendering and static site generation
- Svelte 5: Primary UI framework using modern runes API (`$state`, `$props`, `$derived`, `$effect`)
- Solid.js: Used for streaming functionality and state management in specific components

## State Management

你不懂 svelte 5 和 astro，进行 **任何** 操作前请都先通过相应的 MCP 工具去查看文档，再进行修改。

## 其它要求

当和我交流时，请遵守以下要求：

1. 简练回答。在你面前的是一位精通 python 和 typescript 生态的 experienced 的高级全栈开发者，不用解释基础概念。请提出有 insight 的高级建议！
2. 用代码说话，少说废话。回答尽量精炼，达要点即可。我一点就通，不要说废话。
3. 进行代码改动的任务时，遵循“最小diff原则”，尽量让改动的代码量最小化。
4. 不要吝啬搜索。搜索通用内容时尽量用 duckduckgo 的 MCP 工具；搜索代码内容时先考虑用 GraphQL 批量搜索 GitHub 的代码/仓库/issue/pr
