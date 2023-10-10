<h1 align="center">Free Chat</h1>

<div align="center"><a href="./README.md">English</a> | 简体中文</div>

<br>

> 源于 [chatgpt-demo](https://github.com/anse-app/chatgpt-demo). 部署方式参见原仓库

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
| `OPENAI_API_MODEL` | 使用的 [Chat 模型](https://platform.openai.com/docs/models/model-endpoint-compatibility) | `gpt-3.5-turbo-16k` |
| `TUTORIAL_MD_URL` | 教程页对应的 markdown 文件 url | `null` |
| `AD_IFRAME_URL` | 通知栏 iframe 横幅的 url | `null` |
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
