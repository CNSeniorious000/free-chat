<script lang="ts">
  import ModelItem from './ModelItem.svelte'
  import Hr from './Hr.svelte'
</script>

<div class="grid grid-cols-2 w-full justify-between gap-1.5 text-sm">
  <ModelItem id="deepseek-r1-distill-llama-70b" name="deepseek-r1-llama-70b" title="🧠 DeepSeek 的推理模型 R1" />
  <ModelItem id="qwen-3-32b" name="qwen-3-32b" title="🧠 旗舰混合推理模型 Qwen 3" />
  <ModelItem id="meta-llama/llama-4-maverick-17b-128e-instruct" name="llama4-maverick" title="🚀 Meta 最新的 Llama 4 Maverick" />
  <ModelItem id="llama-3.3-70b" name="llama3.3-70b" title="🚀 超快的 Llama 3.3 70b" />
  <ModelItem id="grok-3-mini-beta" name="grok-3-mini-beta" title="⭐ xAI 的推理模型" />
  <ModelItem id="grok-3-beta" name="grok-3-beta" title="⭐ xAI 最新的 Grok 3" />
  <ModelItem id="deepseek-ai/DeepSeek-V3" name="deepseek-v3" title="深度求索 DeepSeek v3.1" />
  <ModelItem id="gemma-3-27b-it" name="gemma 3" title="Google 最新的开源模型" />
  <ModelItem id="gemini-2.0-flash-lite" name="gemini 2.0 flash lite" title="Google 最新一代 Gemini" />
  <ModelItem id="gemini-2.0-flash-thinking-exp" name="gemini 2.0 flash thinking" title="Google 的推理模型" />
  <!-- <ModelItem id="internlm/internlm2_5-20b-chat" name="internlm2.5-20b" title="✨ 书生·浦语" /> -->
  <ModelItem id="yi-lightning" name="yi-lightning" title="零一万物" />
  <ModelItem id="THUDM/GLM-4-9B-0414" name="glm-4-9b-chat" title="✨ 智谱 AI 四月上新" />
  <Hr text="低可用性模型（延迟较大）" />
  <!-- <ModelItem id="azure:gpt-4o" name="gpt-4o" title="GPT 4o (Azure)" /> -->
  <!-- <ModelItem id="azure:gpt-4o-mini" name="gpt-4o-mini" title="GPT 4o mini (Azure)" /> -->
  <ModelItem id="Mistral-small-2503" name="Mistral-Small" title="Mistral 最新发布的轻快版" />
  <ModelItem id="Mistral-large-2411" name="Mistral-large" title="Mistral 旗舰款" />
  <!-- <ModelItem id="Phi-3.5-MoE-instruct" name="Phi-3.5-MoE-instruct" title="微软的开源模型" /> -->
  <!-- <ModelItem id="Meta-Llama-3.1-405B-Instruct" name="llama-3.1-405b" title="Llama-3.1 405B 超大杯" /> -->
  <ModelItem id="azure:gpt-4.1-mini" name="gpt-4.1-mini" title="OpenAI 最新的 GPT 4.1" />
  <ModelItem id="MAI-DS-R1" name="MAI-DS-R1" title="微软魔改版 DeepSeek R1" />
  <ModelItem id="Cohere-command-a" name="Cohere Command A" title="Cohere 最新的模型 111B 模型" />
  <ModelItem id="Phi-4" name="Phi 4" title="微软 Phi 系列最新款" />
</div>
