# API ROUTES KNOWLEDGE BASE

## STRUCTURE

```
src/pages/api/
├── transcript.ts    # audio transcription (whisper/audio API)
├── chat.ts          # configured chat provider, model catalog and SSE inference
├── siwc.ts          # local ChatGPT account authorization and selection
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

## CHAT BFF

`GET /api/chat` returns the configured provider and model choices. `POST /api/chat` streams chat, title, suggestion, and translation results. ChatGPT plan credentials are kept by the server and must never enter client modules.
