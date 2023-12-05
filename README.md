<h1 align="center">Free Chat</h1>

<div align="center">English | <a href="./README.zh-CN.md">简体中文</a></div>

<br>

> Forked from [chatgpt-demo](https://github.com/anse-app/chatgpt-demo). Find deployment instructions in the original repository.

## Environment Variables

You can control the website through environment variables.

| Name | Description | Default |
| --- | --- | --- |
| `OPENAI_API_KEY` | Your API Key for OpenAI. | `your_openai_api_key_here` |
| `OPENAI_API_TEMPERATURE` | Default `temperature` parameter for model. | `1.0` |
| `HTTPS_PROXY` | Provide proxy for OpenAI API. | `http://your-proxy:port` |
| `OPENAI_API_BASE_URL` | Custom base url for OpenAI API. Default: `https://api.openai.com`. | `https://api.openai.com` |
| `HEAD_SCRIPTS` | Inject analytics or other scripts before `</head>` of the page | `null` |
| `PUBLIC_SECRET_KEY` | Secret string for the project. Used for generating signatures for API calls. | `your_secret_key_here` |
| `SITE_PASSWORD` | Set a password for the site. If not set, the site will be public. | `your_site_password_here` |
| `OPENAI_API_MODEL` | ID of the model to use. See OpenAI's model endpoint compatibility documentation. | `text-davinci-003` |
| `TUTORIAL_MD_URL` | URL of the tutorial markdown file. | `https://your_tutorial_url.md` |
| `PUBLIC_IFRAME_URL` | URL of the advertisement iframe. | `https://your_ad_iframe_url` |
| `UNDICI_UA` | User-agent for backend requests. | `Your User Agent` |
| `PUBLIC_RIGHT_ALIGN_MY_MSG` | whether user messages should be right-aligned | `null` |
| `PUBLIC_CL100K_BASE_JSON_URL` | CDN url for `cl100k_base.json`, such as [file at jsdelivr.net](https://cdn.jsdelivr.net/npm/tiktoken@1.0.10/encoders/cl100k_base.json) | `null` |
| `PUBLIC_TIKTOKEN_BG_WASM_URL` | CDN url for `tiktoken_bg.wasm`, such as [file at esm.sh](https://esm.sh/tiktoken/lite/tiktoken_bg.wasm) | `null` |

## Contributing

This project exists thanks to all those who contributed to [the original project](https://github.com/anse-app/chatgpt-demo).

Thank you to all our supporters!🙏

[![img](https://contributors.nn.ci/api?repo=anse-app/chatgpt-demo)](https://github.com/ddiu8081/chatgpt-demo/graphs/contributors)

## License

MIT © [Muspi Merol](./LICENSE)
