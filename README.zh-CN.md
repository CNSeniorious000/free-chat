<h1 align="center">Free Chat</h1>

<div align="center"><a href="./README.md">English</a> | 简体中文</div>

<br>

> 源于 [chatgpt-demo](https://github.com/anse-app/chatgpt-demo). 部署方式参见原仓库

## 分支

- `main`: 基础分支，包含全部的样式
- `endless`: 加上了基于 token 上限的消息列表裁剪
- `promplate-demo`: 当前开发分支

## 聊天供应商

聊天、标题、回复建议和 Beta 翻译都由 Free Chat BFF 直接调用供应商。在服务端配置 `CHAT_PROVIDER`：

- `siwc`（默认）：使用登录账号的 ChatGPT 订阅额度和可用模型，无需 API Key。运行 `pnpm dev --host 127.0.0.1 --port 43761`，打开 `http://127.0.0.1:43761`，在设置里点击 **Continue with ChatGPT**。必须使用 `127.0.0.1`，不要用 `localhost`；Node 服务应只监听回环地址。[开源 SIWC 流程](https://developers.openai.com/siwc/token-sharing-open-source)不适用于公网托管登录。凭证只存在服务端私有目录（默认 `$XDG_CONFIG_HOME/free-chat` 或 `~/.config/free-chat`，可用 `FREE_CHAT_SIWC_DIR` 指定仓库外的私有目录）；每个目录只启动一个进程，避免刷新令牌竞争。
- `openai-compatible`：配置上游 API 前缀 `CHAT_BASE_URL`（如 `http://127.0.0.1:11434/v1`）和默认模型 `CHAT_MODEL`。可选 `CHAT_API_KEY` 仅存服务端；设置后聊天 BFF 仅接受直连回环请求。

自动标题和回复建议同样使用所选供应商的额度。语音转录独立配置，此 SIWC 接入不包含转录能力。独立审核服务默认关闭（`PUBLIC_MODERATION_INTERVAL=0`）。

## 环境变量

配置本地或者部署的环境变量

| 名称 | 描述 | 默认 |
| --- | --- | --- |
| `OPENAI_API_KEY` | 你的 OpenAI API Key | `null` |
| `OPENAI_API_TEMPERATURE` | 传给模型的 `temperature` 参数 | `1.0` |
| `HTTPS_PROXY` | 为 OpenAI API 提供代理. | `null` |
| `OPENAI_API_BASE_URL` | 请求 OpenAI API 的自定义 Base URL. | `https://api.openai.com` |
| `HEAD_SCRIPTS` | 在页面的 `</head>` 之前注入分析或其他脚本 | `null` |
| `PUBLIC_SECRET_KEY` | 项目的秘密字符串。用于生成 API 调用的签名 | `null` |
| `SITE_PASSWORD` | 为网站设置密码。如果未设置，则该网站将是公开的 | `null` |
| `OPENAI_API_MODEL` | 旧版 `/api/title-gen` 路由的默认模型 | `gpt-4o-mini` |
| `TUTORIAL_MD_URL` | 教程页对应的 markdown 文件 url | `null` |
| `PUBLIC_IFRAME_URL` | 通知栏 iframe 横幅的 url | `null` |
| `UNDICI_UA` | 后端请求的 user-agent | `(forward)` |
| `PUBLIC_RIGHT_ALIGN_MY_MSG` | 用户消息是否右对齐 | `null` |
| `PUBLIC_CL100K_BASE_JSON_URL` | 从 CDN 加载 `cl100k_base.json`，比如可以设为 [jsdelivr.net](https://cdn.jsdelivr.net/npm/tiktoken@1.0.10/encoders/cl100k_base.json) | `null` |
| `PUBLIC_TIKTOKEN_BG_WASM_URL` | 从 CDN 加载 `tiktoken_bg.wasm`，比如可设为 [esm.sh](https://esm.sh/tiktoken/lite/tiktoken_bg.wasm) | `null` |

## 参与贡献

这个项目的存在要感谢[原项目](https://github.com/anse-app/chatgpt-demo)。

感谢我们所有的支持者！🙏

[![img](https://contributors.nn.ci/api?repo=anse-app/chatgpt-demo)](https://github.com/ddiu8081/chatgpt-demo/graphs/contributors)

## License

MIT © [Muspi Merol](./LICENSE)
