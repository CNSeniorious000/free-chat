# API ROUTES KNOWLEDGE BASE

## STRUCTURE

```
src/pages/api/
├── transcript.ts    # audio transcription (whisper/audio API)
├── title-gen.ts     # generate chat titles from message history
├── translate.ts     # text translation service
└── moderate.ts      # content moderation (OpenAI moderation API)
```

## WHERE TO LOOK

| Task             | Location      | Notes                     |
| ---------------- | ------------- | ------------------------- |
| Transcribe audio | transcript.ts | handle audio file uploads |
| Generate titles  | title-gen.ts  | summarize conversation    |
| Translate text   | translate.ts  | multi-language support    |
| Moderate content | moderate.ts   | OpenAI moderation API     |

## CONVENTIONS

### Astro API Routes

导出 async 函数作为 route handler，TypeScript 严格类型，try/catch 错误处理，通过 Astro.response API 返回 JSON，环境变量通过 `import.meta.env` 或 Astro context。

## NOTES

仅后端路由（无需 SSR hydration），无测试覆盖率手动验证，集成 OpenAI API 用于内容审查和标题生成。

## PROMPLATE DEMO BACKEND

Backend: promplate/demo (FastAPI + promplate) at https://github.com/promplate/demo

用 GitHub GraphQL 工具查看 promplate/demo 源码了解 endpoint 实现：

- `GET /heartbeat` - health check
- `GET /models` - list available LLM models (OpenAI-compatible)
- `POST /chat/completions` - OpenAI-compatible chat API
- `POST /prompts/render/{template}` - render template with context (sync/async)
- `GET /prompts/{template}` - show raw template source
- `POST /invoke/{template}` - invoke template (non-streaming)
- `POST /stream/{template}` - invoke template (SSE streaming)
- `PUT /single/{template}` - single-step template run
