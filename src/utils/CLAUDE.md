# UTILITIES KNOWLEDGE BASE

## STRUCTURE

```
src/utils/
├── tiktoken.ts        # token counting (GPT tokenization)
├── streaming.ts       # streaming response handling
├── ripple.ts         # ripple effect animations (256 lines)
├── misc.ts           # miscellaneous utilities (122 lines)
├── auth.ts           # authentication logic
├── constants.ts      # app constants
├── color.ts          # color manipulation utilities
├── client.ts         # client-side utilities
├── cf-workers-ai.ts  # Cloudflare Workers AI integration
├── deepseek.ts       # DeepSeek API integration
├── header.ts         # HTTP header utilities
├── events.ts         # event handling utilities
├── track.ts          # analytics/tracking
└── record.ts         # recording utilities
```

## WHERE TO LOOK

| Task               | Location               | Notes                            |
| ------------------ | ---------------------- | -------------------------------- |
| Token counting     | tiktoken.ts            | GPT tokenization for cost/limits |
| Streaming          | streaming.ts           | handle SSE/streaming responses   |
| Authentication     | auth.ts                | API key handling                 |
| Platform detection | platform.ts (src/lib/) | detect browser/OS                |
| Color utilities    | color.ts               | theme color manipulation         |
| Ripple effects     | ripple.ts              | button click animations          |

## CONVENTIONS

### Utility Patterns

尽可能用纯函数，TypeScript 严格类型，工具函数无副作用，显式错误处理（最少 try/catch），导出命名函数/常量。

### Streaming

Handle Server-Sent Events (SSE)，解析 OpenAI API 的流式响应，支持 chunked text generation。

## NOTES

tiktoken.ts 可能用 tiktoken WASM 做客户端 token 计数，cf-workers-ai.ts 暗示支持 Cloudflare Workers AI，大文件：ripple.ts（256 行）复杂动画逻辑。
