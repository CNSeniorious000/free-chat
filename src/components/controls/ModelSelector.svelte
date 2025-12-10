<script lang="ts">
  import Hr from './Hr.svelte'
  import ModelItem from './ModelItem.svelte'
</script>

<div class="grid grid-cols-2 w-full justify-between gap-1.5 text-sm">
  <ModelItem id="grok-code-fast-1" name="grok-code" title="xAI 最新的编程模型" />
  <ModelItem id="mistralai/devstral-2512:free" name="devstral-2512" title="Mistral 的编程模型" />
  <ModelItem id="glm-4.5-flash" name="glm-4.5-flash" title="✨ 智谱清言开源巨作 GLM 4.5" />
  <ModelItem id="z-ai/glm-4.5-air:free" name="glm-4.5-air" title="✨ 智谱清言开源巨作 GLM 4.5" />
  <ModelItem id="moonshotai/kimi-k2-instruct-0905" name="kimi-k2" title="🌚 月之暗面 Kimi K2" />
  <ModelItem id="tngtech/tng-r1t-chimera:free" name="tng-r1t-chimera" title="💞 创意故事与角色互动实验模型 (较慢)" />
  <ModelItem id="zai-glm-4.6" name="glm-4.6" title="🚀 智谱清言开源巨作 GLM 4.6" />
  <ModelItem id="gpt-oss-120b" name="gpt-oss-120b" title="🚀 OpenAI 最新开源的推理模型" />
  <ModelItem id="qwen-3-32b" name="qwen-3-32b" title="🧠 Qwen 通义千问推理模型 Qwen 3 32B" />
  <ModelItem id="qwen-3-235b-a22b-instruct-2507" name="qwen-3-235b-instruct" title="✨ 通义千问最新模型 Qwen 3 235B" />
  <ModelItem id="Llama-4-Maverick-17B-128E-Instruct" name="llama4-maverick" title="🚀 Meta 最新的 Llama 4 Maverick" />
  <ModelItem id="llama-3.3-70b" name="llama3.3-70b" title="🚀 超快的 Llama 3.3 70b" />
  <ModelItem id="DeepSeek-V3.1-Terminus" name="deepseek-v3.1-terminus" title="🐋 最新 DeepSeek v3.1 Terminus" />
  <ModelItem id="deepseek-ai/DeepSeek-V3.2-Exp" name="deepseek-v3.2-exp" title="🐋 DeepSeek 最新款" />
  <ModelItem id="gemma-3-27b-it" name="gemma 3" title="Google 最新的开源模型" />
  <ModelItem id="gemini-2.5-flash" name="gemini 2.5 flash" title="Google 最新一代 Gemini" />
  <ModelItem id="nex-agi/deepseek-v3.1-nex-n1:free" name="deepseek-v3.1-nex-n1" title="DeepSeek 上海创智学院后训练版" />
  <!-- <ModelItem id="internlm/internlm2_5-20b-chat" name="internlm2.5-20b" title="✨ 书生·浦语" /> -->
  <ModelItem id="yi-lightning" name="yi-lightning" title="零一万物" />
  <ModelItem id="kwaipilot/kat-coder-pro:free" name="Kat Coder Pro" title="✨ 快手出品的编程模型" />
  <ModelItem id="allenai/olmo-3-32b-think:free" name="olmo-3-32b-think" title="🧠 开源的深度推理模型" />
  <ModelItem id="amazon/nova-2-lite-v1:free" name="nova-2-lite-v1" title="适用于日常任务 / 长上下文" />
  <ModelItem id="arcee-ai/trinity-mini:free" name="trinity-mini" title="arcee-ai 高效的开源模型" />
  <Hr text="低可用性模型（延迟较大）" />
  <ModelItem id="Mistral-medium-2505" name="Mistral-Medium" title="Mistral 五月上新" />
  <ModelItem id="Mistral-large-2411" name="Mistral-large" title="Mistral 旗舰款" />
  <!-- <ModelItem id="Phi-3.5-MoE-instruct" name="Phi-3.5-MoE-instruct" title="微软的开源模型" /> -->
  <!-- <ModelItem id="Meta-Llama-3.1-405B-Instruct" name="llama-3.1-405b" title="Llama-3.1 405B 超大杯" /> -->
  <ModelItem id="azure:gpt-5-chat" name="gpt-5" title="🔥 OpenAI 最新的 GPT 5" />
  <ModelItem id="azure:gpt-4.1" name="gpt-4.1" title="🔥 OpenAI 最新的 GPT 4.1" />
  <ModelItem id="azure:o3" name="o3" title="🔥 OpenAI 的高级推理模型" />
  <ModelItem id="azure:o4-mini" name="o4-mini" title="🔥 OpenAI 的快速推理模型" />
  <ModelItem id="Cohere-command-a" name="Cohere Command A" title="Cohere 最新的模型 111B 模型" />
  <ModelItem id="Phi-4" name="Phi 4" title="微软 Phi 系列最新款" />
</div>
