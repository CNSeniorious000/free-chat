<script lang="ts">
  import ModelItem from './ModelItem.svelte'
</script>

<div class="grid grid-cols-2 w-full justify-between gap-1.5 rounded-md bg-$c-fg-2 p-1.5 text-sm">
  <ModelItem id="llama-3.2-90b-text-preview" name="llama3.2-90b" title="🚀 Meta 最新发布的 Llama3.2" />
  <ModelItem id="llama3.1-70b" name="llama3.1-70b" title="🚀 Cerebras 提供的超快 Llama3.1" />
  <ModelItem id="mixtral-8x7b-32768" name="mixtral-8x7b" title="🚀 来自法国的明星大模型 Mixtral" />
  <ModelItem id="gemma2-9b-it" name="gemma2-9b-it" title="🚀 Google 最新发布的 Gemma 2" />
  <ModelItem id="gpt-3.5-turbo-0125" name="gpt-3.5-turbo" title="填写自己的 API Key 以使用" />
  <ModelItem id="gpt-4o-mini-2024-07-18" name="gpt-4o-mini" title="🔥 OpenAI 最新的全能模型" />
  <ModelItem id="nous-hermes-2-mixtral-8x7b-dpo" name="nous-hermes-2" title="基于 Mixtral 的 MOE 模型" />
  <ModelItem id="internlm/internlm2_5-20b-chat" name="internlm2.5-20b" title="✨ 书生·浦语" />
  <ModelItem id="Qwen/Qwen2.5-32B-Instruct" name="Qwen2.5-32B-Instruct" title="✨ 通义千问" />
  <ModelItem id="01-ai/Yi-1.5-34B-Chat-16K" name="Yi-1.5-34B-Chat" title="✨ 零一万物" />
  <ModelItem id="THUDM/glm-4-9b-chat" name="glm-4-9b-chat" title="✨ 智谱 AI" />
  <ModelItem id="deepseek-ai/DeepSeek-V2.5" name="DeepSeek-V2.5" title="✨ 深度求索" />
</div>
