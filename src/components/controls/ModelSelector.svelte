<script lang="ts">
  import Hr from './Hr.svelte'
  import ModelItem from './ModelItem.svelte'
</script>

<div class="grid grid-cols-2 w-full justify-between gap-1.5 text-sm">
  <ModelItem id="mimo-v2.5-pro" name="mimo-v2.5-pro" title="🛠️ 长程 agent 与软件工程旗舰" />
  <ModelItem id="mimo-v2.5" name="mimo-v2.5" title="👁️ 多模态 + 1M 上下文，高性价比" />
  <ModelItem id="gpt-5.4" name="gpt-5.4" title="🧠 OpenAI 面向专业工作的最强高效模型" />
  <ModelItem id="gpt-5.3-codex" name="gpt-5.3-codex" title="💻 OpenAI 最强 agentic 编程模型" />
  <ModelItem id="gpt-5.2" name="gpt-5.2" title="🧠 OpenAI 前沿模型，适合复杂专业工作" />
  <ModelItem id="gpt-5.2-codex" name="gpt-5.2-codex" title="💻 适合代码理解与编程对话" />
  <ModelItem id="qwen/qwen3.6-plus:free" name="qwen3.6-plus" title="🧠 通义千问 Qwen 3.6 Plus" />
  <ModelItem id="grok-4-1-fast-non-reasoning" name="grok-4.1" title="xAI 旗舰的通用模型" />
  <ModelItem id="stepfun/step-3.5-flash:free" name="step-3.5-flash" title="⚡ 阶跃最新的 Step 3.5 Flash" />
  <ModelItem id="nvidia/nemotron-3-nano-30b-a3b:free" name="Nemotron-3-Nano" title="NVIDIA 最新的开源 agentic 小模型" />
  <ModelItem id="moonshotai/kimi-k2-instruct-0905" name="kimi-k2" title="🌚 月之暗面 Kimi K2" />
  <ModelItem id="nvidia/nemotron-3-super-120b-a12b:free" name="Nemotron-3-Super" title="🚀 NVIDIA 更强的开源 agentic 120B 模型" />
  <ModelItem id="zai-glm-4.7" name="glm-4.7" title="🚀 智谱清言开源巨作 GLM 4.7" />
  <ModelItem id="gpt-oss-120b" name="gpt-oss-120b" title="🚀 OpenAI 最新开源的推理模型" />
  <ModelItem id="Qwen3-32B" name="qwen-3-32b" title="🧠 Qwen 通义千问推理模型 Qwen 3 32B" />
  <ModelItem id="Qwen3-235B" name="qwen-3-235b" title="✨ 通义千问最新模型 Qwen 3 235B" />
  <ModelItem id="meta-llama/llama-4-maverick-17b-128e-instruct" name="llama4-maverick" title="🚀 Meta 最新的 Llama 4 Maverick" />
  <ModelItem id="llama-3.3-70b" name="llama3.3-70b" title="🚀 超快的 Llama 3.3 70b" />
  <ModelItem id="DeepSeek-V3.1-Terminus" name="deepseek-v3.1-terminus" title="🐋 最新 DeepSeek v3.1 Terminus" />
  <ModelItem id="DeepSeek-V3.2" name="deepseek-v3.2" title="🐋 DeepSeek 最新款" />
  <ModelItem id="gemma-3-27b-it" name="gemma 3" title="Google 最新的开源模型" />
  <ModelItem id="gemini-2.5-flash-lite" name="gemini 2.5 flash lite" title="Google 最新一代 Gemini" />
  <!-- <ModelItem id="internlm/internlm2_5-20b-chat" name="internlm2.5-20b" title="✨ 书生·浦语" /> -->
  <ModelItem id="yi-lightning" name="yi-lightning" title="零一万物" />
  <ModelItem id="arcee-ai/trinity-mini:free" name="trinity-mini" title="arcee-ai 高效的开源模型" />
  <Hr text="官方 GLM 专区" />
  <ModelItem id="glm-4.7" name="glm-4.7" title="✨ 智谱 GLM 4.7 最新旗舰" />
  <ModelItem id="glm-4.6" name="glm-4.6" title="智谱 GLM 4.6" />
  <ModelItem id="glm-4.6v" name="glm-4.6v" title="智谱 GLM 4.6V 视觉模型" />
  <ModelItem id="glm-4.5v" name="glm-4.5v" title="智谱 GLM 4.5V 视觉模型" />
  <ModelItem id="glm-4.5" name="glm-4.5" title="智谱 GLM 4.5" />
  <ModelItem id="glm-4.5-flash" name="glm-4.5-flash" title="智谱 GLM 4.5 Flash 超轻量模型" />
  <ModelItem id="z-ai/glm-4.5-air:free" name="glm-4.5-air" title="智谱 GLM 4.5 Air 轻量模型" />
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
