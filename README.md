<h1 align="center">Free Chat</h1>

<div align="center">English | <a href="./README.zh-CN.md">简体中文</a></div>

<br>

> Forked from [chatgpt-demo](https://github.com/anse-app/chatgpt-demo). Find deployment instructions in the original repository.

## Branches

- `main`: the base branch containing all the styles
- `endless`: includes token-based message list trimming
- `promplate-demo`: active development branch

## Chat Providers

Chat, titles, reply suggestions, and the beta translator call the Free Chat BFF directly. Set `CHAT_PROVIDER` on the server:

- `siwc` (default): uses the signed-in account's ChatGPT plan and available models, without an API key. Run `pnpm dev --host 127.0.0.1 --port 43761`, open `http://127.0.0.1:43761`, and choose **Continue with ChatGPT** in Settings. Use `127.0.0.1`, not `localhost`, and keep the Node server private and bound to loopback. The [OSS SIWC flow](https://developers.openai.com/siwc/token-sharing-open-source) is not for public or hosted sign-in. Credentials stay in a private server directory (`$XDG_CONFIG_HOME/free-chat` or `~/.config/free-chat` by default; override with `FREE_CHAT_SIWC_DIR`, outside the repo). Run only one process per directory so token refreshes stay serialized.
- `openai-compatible`: set `CHAT_BASE_URL` to the upstream API prefix (for example `http://127.0.0.1:11434/v1`) and `CHAT_MODEL` to the default model. `CHAT_API_KEY` is optional and server-only; when set, the chat BFF accepts only direct loopback traffic.

Titles and suggestions also use the configured provider's quota. Transcription is configured separately; ChatGPT plan usage does not include transcription through this integration. Separate moderation is disabled by default (`PUBLIC_MODERATION_INTERVAL=0`).

## Environment Variables

You can control the website through environment variables.

| Name | Description | Default |
| --- | --- | --- |
| `OPENAI_API_KEY` | Your API Key for OpenAI. | `null` |
| `OPENAI_API_TEMPERATURE` | Default `temperature` parameter for model. | `1.0` |
| `HTTPS_PROXY` | Provide proxy for OpenAI API. | `null` |
| `OPENAI_API_BASE_URL` | Custom base url for OpenAI API. | `https://api.openai.com` |
| `HEAD_SCRIPTS` | Inject analytics or other scripts before `</head>` of the page | `null` |
| `PUBLIC_SECRET_KEY` | Secret string for the project. Use for generating signatures for API calls | `null` |
| `SITE_PASSWORD` | Set password for site. If not set, site will be public | `null` |
| `OPENAI_API_MODEL` | Default model for the legacy `/api/title-gen` route. | `gpt-4o-mini` |
| `TUTORIAL_MD_URL` | url of the tutorial markdown file | `null` |
| `PUBLIC_IFRAME_URL` | url of the advertisement iframe | `null` |
| `UNDICI_UA` | user-agent for backend requests | `(forward)` |
| `PUBLIC_RIGHT_ALIGN_MY_MSG` | whether user messages should be right-aligned | `null` |
| `PUBLIC_CL100K_BASE_JSON_URL` | CDN url for `cl100k_base.json`, such as [file at jsdelivr.net](https://cdn.jsdelivr.net/npm/tiktoken@1.0.10/encoders/cl100k_base.json) | `null` |
| `PUBLIC_TIKTOKEN_BG_WASM_URL` | CDN url for `tiktoken_bg.wasm`, such as [file at esm.sh](https://esm.sh/tiktoken/lite/tiktoken_bg.wasm) | `null` |

## Contributing

This project exists thanks to all those who contributed to [the original project](https://github.com/anse-app/chatgpt-demo).

Thank you to all our supporters!🙏

[![img](https://contributors.nn.ci/api?repo=anse-app/chatgpt-demo)](https://github.com/ddiu8081/chatgpt-demo/graphs/contributors)

## License

MIT © [Muspi Merol](./LICENSE)
