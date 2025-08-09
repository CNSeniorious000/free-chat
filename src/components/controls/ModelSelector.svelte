<script lang="ts">
  import Hr from './Hr.svelte'
  import ModelItem from './ModelItem.svelte'
</script>

<div class="grid grid-cols-2 w-full justify-between gap-1.5 text-sm">
  <ModelItem id="glm-4.5-flash" name="glm-4.5-flash" title="✨ 智谱清言开源巨作 GLM 4.5" />
  <ModelItem id="moonshotai/kimi-k2:free" name="kimi-k2" title="🌚 月之暗面 Kimi K2" />
  <ModelItem id="deepseek/deepseek-r1-0528:free" name="deepseek-r1-0528" title="🐋 DeepSeek 最新版 R1" />
  <ModelItem id="deepseek-r1-distill-llama-70b" name="deepseek-r1-llama-70b" title="🧠 DeepSeek 的推理模型 R1" />
  <ModelItem id="gpt-oss-120b" name="gpt-oss-120b" title="🚀 OpenAI 最新开源的推理模型" />
  <ModelItem id="qwen-3-coder-480b" name="qwen-3-coder-480b" title="🧠 旗舰代码模型 Qwen 3 480B" />
  <ModelItem id="qwen-3-235b-a22b-thinking-2507" name="qwen-3-235b-thinking" title="🧠 旗舰混合推理模型 Qwen 3 235B" />
  <ModelItem id="qwen-3-235b-a22b-instruct-2507" name="qwen-3-235b-instruct" title="✨ 通义千问最新模型 Qwen 3 235B" />
  <ModelItem id="meta-llama/llama-4-maverick-17b-128e-instruct" name="llama4-maverick" title="🚀 Meta 最新的 Llama 4 Maverick" />
  <ModelItem id="llama-3.3-70b" name="llama3.3-70b" title="🚀 超快的 Llama 3.3 70b" />
  <ModelItem id="deepseek/deepseek-chat-v3-0324:free" name="deepseek-v3" title="深度求索 DeepSeek v3.1" />
  <ModelItem id="gemma-3-27b-it" name="gemma 3" title="Google 最新的开源模型" />
  <ModelItem id="gemini-2.0-flash-lite" name="gemini 2.0 flash lite" title="Google 最新一代 Gemini" />
  <ModelItem id="gemini-2.0-flash-thinking-exp" name="gemini 2.0 flash thinking" title="Google 的推理模型" />
  <!-- <ModelItem id="internlm/internlm2_5-20b-chat" name="internlm2.5-20b" title="✨ 书生·浦语" /> -->
  <ModelItem id="yi-lightning" name="yi-lightning" title="零一万物" />
  <ModelItem id="THUDM/GLM-4-9B-0414" name="glm-4-9b-chat" title="✨ 智谱 AI 四月上新" />
  <Hr text="低可用性模型（延迟较大）" />
  <!-- <ModelItem id="azure:gpt-4o" name="gpt-4o" title="GPT 4o (Azure)" /> -->
  <!-- <ModelItem id="azure:gpt-4o-mini" name="gpt-4o-mini" title="GPT 4o mini (Azure)" /> -->
  <ModelItem id="Mistral-medium-2505" name="Mistral-Medium" title="Mistral 五月上新" />
  <ModelItem id="Mistral-large-2411" name="Mistral-large" title="Mistral 旗舰款" />
  <!-- <ModelItem id="Phi-3.5-MoE-instruct" name="Phi-3.5-MoE-instruct" title="微软的开源模型" /> -->
  <!-- <ModelItem id="Meta-Llama-3.1-405B-Instruct" name="llama-3.1-405b" title="Llama-3.1 405B 超大杯" /> -->
  <ModelItem id="azure:gpt-5-mini" name="gpt-5-mini" title="OpenAI 最新的 GPT 5" />
  <ModelItem id="azure:gpt-4.1-mini" name="gpt-4.1-mini" title="OpenAI 最新的 GPT 4.1" />
  <ModelItem id="Cohere-command-a" name="Cohere Command A" title="Cohere 最新的模型 111B 模型" />
  <ModelItem id="Phi-4" name="Phi 4" title="微软 Phi 系列最新款" />
</div>
