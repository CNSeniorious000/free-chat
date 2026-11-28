<h1 align="center">Free Chat</h1>

<div align="center">English | <a href="./README.zh-CN.md">简体中文</a></div>

<br>

> Forked from [chatgpt-demo](https://github.com/anse-app/chatgpt-demo). Find deployment instructions in the original repository.

## Branches

- `main`: the base branch containing all the styles
- `endless`: includes token-based message list trimming
- `promplate-demo`: active developed, for demonstrating the usage of [`promplate`](http://promplate.dev/)

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
| `OPENAI_API_MODEL` | ID of the model to use. [Model endpoint compatibility](https://platform.openai.com/docs/models/model-endpoint-compatibility) | `gpt-4o-mini` |
| `TUTORIAL_MD_URL` | url of the tutorial markdown file | `null` |
| `PUBLIC_IFRAME_URL` | url of the advertisement iframe | `null` |
| `UNDICI_UA` | user-agent for backend requests | `(forward)` |
| `PUBLIC_RIGHT_ALIGN_MY_MSG` | whether user messages should be right-aligned | `null` |
| `PUBLIC_CL100K_BASE_JSON_URL` | CDN url for `cl100k_base.json`, such as [file at jsdelivr.net](https://cdn.jsdelivr.net/npm/tiktoken@1.0.10/encoders/cl100k_base.json) | `null` |
| `PUBLIC_TIKTOKEN_BG_WASM_URL` | CDN url for `tiktoken_bg.wasm`, such as [file at esm.sh](https://esm.sh/tiktoken/lite/tiktoken_bg.wasm) | `null` |

## Sign in with ChatGPT

Promplate remains the default. On the computer running your browser, run `pnpm install --frozen-lockfile` and `pnpm dev --host 127.0.0.1 --port 43761`. Open `http://127.0.0.1:43761` (not `localhost`), select **ChatGPT 订阅** in Settings, then click **Continue with ChatGPT**. The model picker shows the signed-in account's available models. No API key is needed for SIWC.

The SIWC history stays separate and does not send prompts to the legacy title, suggestion, or moderation endpoints. Credentials stay in a private local directory. Set `FREE_CHAT_SIWC_DIR` to override the path, which defaults to `$XDG_CONFIG_HOME/free-chat` when `XDG_CONFIG_HOME` is set and `~/.config/free-chat` otherwise. Use each credential directory from only one process to avoid concurrent refreshes.

The [OSS plan-usage flow](https://developers.openai.com/siwc/token-sharing-open-source) is for local sign-in with a loopback callback. Keep the server bound to `127.0.0.1` when using this flow. Vercel Preview retains the default provider.

## Contributing

This project exists thanks to all those who contributed to [the original project](https://github.com/anse-app/chatgpt-demo).

Thank you to all our supporters!🙏

[![img](https://contributors.nn.ci/api?repo=anse-app/chatgpt-demo)](https://github.com/ddiu8081/chatgpt-demo/graphs/contributors)

## License

MIT © [Muspi Merol](./LICENSE)
