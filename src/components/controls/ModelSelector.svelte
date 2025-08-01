<script lang="ts">
  import Hr from './Hr.svelte'
  import ModelItem from './ModelItem.svelte'
</script>

<div class="grid grid-cols-2 w-full justify-between gap-1.5 text-sm">
  <ModelItem id="glm-4.5-flash" name="glm-4.5-flash" title="✨ 智谱清言开源巨作 GLM 4.5" />
  <ModelItem id="moonshotai/kimi-k2:free" name="kimi-k2" title="🌚 月之暗面 Kimi K2" />
  <ModelItem id="DeepSeek-R1-0528" name="deepseek-r1-0528" title="🐋 DeepSeek 最新版 R1" />
  <ModelItem id="DeepSeek-V3-0324" name="deepseek-v3" title="✨ 深度求索最新发布的 DeepSeek v3" />
  <ModelItem id="qwen-3-235b-a22b-thinking-2507" name="qwen-3-235b-thinking" title="🧠 旗舰混合推理模型 Qwen 3 235B" />
  <ModelItem id="qwen-3-235b-a22b-instruct-2507" name="qwen-3-235b-instruct" title="✨ 通义千问最新模型 Qwen 3 235B" />
  <ModelItem id="Llama-4-Maverick-17B-128E-Instruct" name="llama4-maverick" title="🚀 Meta 最新的 Llama 4 Maverick" />
  <ModelItem id="llama-3.3-70b" name="llama3.3-70b" title="🚀 超快的 Llama 3.3 70b" />
  <ModelItem id="grok-3-mini-beta" name="grok-3-mini-beta" title="⭐ xAI 的推理模型" />
  <ModelItem id="grok-3-beta" name="grok-3-beta" title="⭐ xAI 最新的 Grok 3" />
  <ModelItem id="gemini-2.0-flash" name="gemini 2.0 flash lite" title="Google 最新一代 Gemini" />
  <ModelItem id="gemini-2.0-flash-thinking-exp" name="gemini 2.0 flash thinking" title="Google 的推理模型" />
  <!-- <ModelItem id="internlm/internlm2_5-20b-chat" name="internlm2.5-20b" title="✨ 书生·浦语" /> -->
  <ModelItem id="yi-lightning" name="yi-lightning" title="零一万物" />
  <ModelItem id="THUDM/GLM-4-32B-0414" name="glm-4-32b-chat" title="✨ 智谱 AI 四月上新" />
  <Hr text="低可用性模型（延迟较大）" />
  <ModelItem id="Mistral-medium-2505" name="Mistral-Medium" title="Mistral 五月上新" />
  <ModelItem id="Mistral-large-2411" name="Mistral-large" title="Mistral 旗舰款" />
  <!-- <ModelItem id="Phi-3.5-MoE-instruct" name="Phi-3.5-MoE-instruct" title="微软的开源模型" /> -->
  <!-- <ModelItem id="Meta-Llama-3.1-405B-Instruct" name="llama-3.1-405b" title="Llama-3.1 405B 超大杯" /> -->
  <ModelItem id="azure:gpt-4.1" name="gpt-4.1" title="🔥 OpenAI 最新的 GPT 4.1" />
  <ModelItem id="azure:o3" name="o3" title="🔥 OpenAI 的高级推理模型" />
  <ModelItem id="azure:o4-mini" name="o4-mini" title="🔥 OpenAI 的快速推理模型" />
  <ModelItem id="MAI-DS-R1" name="MAI-DS-R1" title="微软魔改版 DeepSeek R1" />
  <ModelItem id="Cohere-command-a" name="Cohere Command A" title="Cohere 最新的模型 111B 模型" />
  <ModelItem id="Phi-4" name="Phi 4" title="微软 Phi 系列最新款" />
</div>
