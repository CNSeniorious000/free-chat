# Development Guide

当你非要执行 npm 命令的时候，一定不要用 npm，而是用 pnpm 或 bun 来替代！

修改完前端代码就调用一次 eslint MCP 工具来检查代码质量

请优先尝试使用 m MCP 提供的工具来获取网页内容，都失败的话再考虑用 firecrawl，但当访问仓库时，优先使用 gh CLI

当你要添加依赖时【禁止】使用 file editing 的工具直接修改 package.json，而是用 pnpm add 来添加依赖。这样添加依赖之后，会自动更新 package.json 和 pnpm-lock.yaml，确保依赖版本的一致性。

> 现在 gh 的 MCP 工具支持调用 GitHub 的 GraphQL API 了，请优先使用它来读取 GitHub 上的文件，而且同时读内容和元数据

# 我的代码偏好

1. 我喜欢深入浅出的响应，操作类就精炼地告诉我做了什么，问答/分析类就提供最核心的洞见
2. 我喜欢casual真性情的语气，可以BTW介绍知识或分享灵感，我们很平等
3. 分点很好但不喜欢加粗语法，可以分段但不要过度使用列表，精炼是宗旨
4. 在结束前看一下IDE有没有给出一些diagnoses
5. 先参考网上的资料，确保了解清楚了再进行操作
6. 如果搜索不到某个知识，可以问我而不是立马开干

# 写好前端/TypeScript 代码的要求

1. 尽量永远不要用 any 类型，除非绝对必要。优先使用严格的类型定义。
2. 对于组件的 prop 和 state，使用 TypeScript interface 或 type 来定义清晰的结构
3. 这个项目使用 Svelte 5，务必使用 runes API（$state, $props, $derived, $effect）
4. 可以使用现代 JavaScript 语法（optional chaining, nullish coalescing, destructuring 等）
5. 偏好使用 interface 而不是 type 来定义对象结构，但根据场景灵活选择
6. 做恰好足够的类型标注，能自动推断出来的可以省略，但公共 API 最好有完整的类型定义
7. 尽量都用 ES6 import/export 而不是 require
8. 在 Svelte 组件中使用 <script lang="ts"> 来启用 TypeScript
9. 安装依赖时使用 pnpm add 或 bun add，而不是 npm install

# 其它要求

1. 一个重要的原则是，尽量少造成影响。或者说，让 diff 尽量小
2. 用中文与我对话，但是不要在代码中出现任何中文！注释和 docstring 中也不行！
3. 不要过度封装 —— 过度的错误处理只会 shadow 错误，掩盖问题
4. 对于可能为 undefined 的值，使用 optional chaining (?.) 和 nullish coalescing (??) 来安全处理
5. 对于 TypeScript 类型断言，优先使用 as 类型断言，必要时使用 // @ts-ignore 注释
6. 总是先看看各种文件，确保了解了整个库是什么原理后，再开始写代码
7. 关于 commit message，我喜欢单行的，动词开头的，小写字母打投的，短于 80 个字母的。在这个项目中我不用 fix: feat: 前缀。另外必须用 native 又 concise 的英文来表达
8. 运行脚本（比如测试命令）的时候，最稳妥的方式是直接用 pnpm 或 bun 来运行（比如 pnpm test，注意不要使用 npm run）
9. 你可以在任务进行中临时创建一些直接运行的一次性文件，来验证某些功能，但是记得在你结束前删掉这些临时文件
10. 你可以通过 MCP 从 IDE 中 getDiagnostics 来获得一些 lint 信息而不是通过命令行，但是不要用 IDE 运行构建脚本，因为可能在 notebook 环境中运行
11. 在你遇到一些 Svelte 5/Astro specification 相关的东西的时候，你可以使用 `m` 的 `read_page` 上网搜搜，但以官方文档为准
12. 这个项目使用 Svelte 5 和 Astro，务必遵循最新的最佳实践和文档
13. 当你要搜索 web 的时候，建议你使用 FireCrawl 的 search，但是当你阅读确定的 url 时（大多数情况）请用 `m` 的 `read_page` 以控制成本。SERP 的价格真的很高。
14. 当你要搜索文档，比如 Svelte 5 API / Astro 框架文档 / TypeScript 最新规范，请用 `m` 的 `read_page` 访问源网页看看
15. 当你要进行一些涉及什么框架的重构时，可以用 m MCP server 的 GitHub GraphQL 工具看一些代码再写，总之不要一开始就按你的想法开始写
16. 不要在子任务中执行代码修改等非幂等的操作。只在子任务中搜索资料等等
17. 你可以使用 `gh` CLI 来使用 GitHub，但是尽量不要用 `gh api` 子命令，除非你用 `-q / --jq` 和 `-t / --template` 让它只输出你需要的字段，比如 `gh api repos/owner/repo-name/path/to/file` 就能获得一个 JSON 响应，包含那个文件的元数据和 base64 编码的文本。请用 `--jq` 和 base64
    解码来看看它的文本内容，而不是直接这么调用这一条命令
18. 在 summary 的时候，请务必在总结中加入“遇到了哪些问题、如何处理的”这样的记述。加入原因更好。这是很重要的经验
19. 在 summary 的时候，也要加上你在过程中阅读了哪些有用的 url 的记录，以备之后查看用
20. 在开发时如果需要调试输出，建议使用浏览器开发者工具或 console.log，并且注意移除生产环境的调试代码
21. 不要浪费时间更新 thinking verbs / status line
22. 如果看到与你当前任务不相关的 lint error：如果是 eslint 的，请运行 eslint --fix 或添加合适的注释忽略；如果是 type checking 相关错误，不要浪费时间管它们
23. 不要用 npx，用 bunx 或者 pnpx，其它命令也类似，都用 bun 或者 pnpm 来启动，比如 bun outdated，bun dev（但通常我会把dev服务器起好，所以你不用自己启动）
24. 你可以用 `gh` CLI 来搜索 GitHub，比如用 `gh search issues is:open repo:your-org/your-repo` 来查看项目相关的 issues
25. 首选 m 工具提供的 MCP 工具来读取网页，firecrawl 太贵了用不起！
26. Read 一个项目中的文件的时候一定要读取完整，不要选择性地读取某些行
27. 永远不要主动使用 firecrawl 的 MCP 工具！除非你已经尝试过用 m 的 MCP 工具了。对于代码搜索，确保你已经尝试过用 gh search 或者 gh API 来搜索过了！
28. 尽量用 m MCP 工具提供的 graphql 工具来搜索 GitHub 和访问 GitHub 上的文件，但是在使用前尽量先 introspection 一下有哪些参数和返回值什么的

# 当我要求你研究某个 GitHub 项目时

你必须去访问它的自述文件、目录结构，一些比如 readme, package.json, tsconfig.json 以及它的文档站 / wiki，还有直接用 GraphQL 访问它的源码看看。

我让 m 的 MCP 工具返回 yaml，因此用 graphql 来同时查看多个文件以及它们的 commit 的元数据非常可读。永远优先使用这种方式来浏览 GitHub

---

## 重要原则

**我是在前端和 TypeScript 方面非常 experienced 的高级开发者，请在跟我沟通的时候尽量 concise 并且不用介绍基本常识！**

当要进行在网上搜索/探究一些什么的时候，用一个个子 Task 完成。给子 Task 提供足够多的上下文信息（包括我的所有要求。因为这些要求往往很微妙，如果你不跟子任务说清楚它就不会按我说的来）

---

当你在网上探索的时候，请采用多种方式。比如用 m 的全网搜索，用较短的 query，搜索多组。搜索英文：搜索中文≈5:2即可。再用 GitHub 的 GraphQL 来搜索代码。注意使用 GraphQL 的时候你可以同时搜索多个字段、多个仓库、多个文件路径等等。这样可以大大节省成本。可以在最开始的时候，先从问问 perplexity
开始，看看它能给出哪些相关的搜索什么的。perplexity 经常不太稳定，可以重试 5 次。

在得到搜索结果后，你应该用 m 的 read_pages 工具读取你觉得相关的每个网页。可以进行树状的探索。想象你是一个学者，你要为你的结论负责！

---

## External Resources

- Astro Documentation: `https://docs.astro.build/` 请优先使用 astro 的 MCP 工具来调取 astro 文档
- Svelte 5 Documentation: `https://svelte.dev/docs/svelte/` 请优先使用 svelte5 的 MCP 工具来看 Svelte 文档

读取其它网页都用 read_urls 工具；读取 GitHub 上的文件都用 gh MCP 的 GraphQL 工具

做任何前端改动前，都先在文档中搜索看看相关的信息。

## When Stuck

1. 查阅 Svelte 5 runes API 文档，了解 `$state`, `$props`, `$derived`, `$effect` 的使用
2. 搜索项目 issues: `gh search issues is:open repo:free-chat free-chat`
3. For web research, use MCP tools `github_graphql`, `read_urls` 和特定领域的 MCP 工具
4. 检查你运行代码的方式是不是不对。请使用 pnpm run 或者 bun run，不要用 npm run
5. 不要吝啬搜索！搜索通用内容时尽量用 read_urls 的 MCP 工具；搜索代码内容时先考虑用 GraphQL 批量搜索 GitHub 的代码/仓库/issue/pr

---

记住，当你要执行前端脚本或安装依赖的时候，一定要用 pnpm 或 bun，而不是 npm！

**我是在前端和 TypeScript 方面非常 experienced 的高级开发者，请在跟我沟通的时候尽量 concise 并且不用介绍基本常识！**

---

另外，对于大型库和组件，尽量使用动态 import（import()）来减少初始 bundle 的大小。这很关键。尽量在需要的时候再导入！看看项目中其他组件是怎么进行模块导入的

---

不要用 read_urls 来访问 GitHub 上的资源。对于 GitHub 操作，一律使用 github_graphql MCP 工具，也不要用 gh CLI
