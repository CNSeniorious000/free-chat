<script lang="ts">
  import Hr from './Hr.svelte'
  import ModelItem from './ModelItem.svelte'
</script>

<div class="grid grid-cols-2 w-full justify-between gap-1.5 text-sm">
  <ModelItem id="x-ai/grok-4.1-fast:free" name="grok-4.1-fast" title="xAI 最新的旗舰模型" />
  <ModelItem id="qwen/qwen3-coder:free" name="qwen-coder-480b" title="Qwen 编程模型" />
  <ModelItem id="glm-4.5-flash" name="glm-4.5-flash" title="✨ 智谱清言开源巨作 GLM 4.5" />
  <ModelItem id="z-ai/glm-4.5-air:free" name="glm-4.5-air" title="✨ 智谱清言开源巨作 GLM 4.5" />
  <ModelItem id="moonshotai/kimi-k2-instruct-0905" name="kimi-k2" title="🌚 月之暗面 Kimi K2" />
  <ModelItem id="DeepSeek-V3.1-Terminus" name="deepseek-v3.1-terminus" title="🐋 最新 DeepSeek v3.1 Terminus" />
  <ModelItem id="MiniMax-M2" name="MiniMax-M2" title="MiniMax 高效率编码模型" />
  <ModelItem id="deepseek-ai/DeepSeek-V3.2-Exp" name="deepseek-v3.2-exp" title="🐋 DeepSeek 实验模型" />
  <ModelItem id="zai-glm-4.6" name="glm-4.6" title="🚀 智谱清言开源巨作 GLM 4.6" />
  <ModelItem id="gpt-oss-120b" name="gpt-oss-120b" title="🚀 OpenAI 最新开源的推理模型" />
  <ModelItem id="qwen-3-32b" name="qwen-3-32b" title="🧠 Qwen 通义千问推理模型 Qwen 3 32B" />
  <ModelItem id="qwen-3-235b-a22b-instruct-2507" name="qwen-3-235b-instruct" title="✨ 通义千问最新模型 Qwen 3 235B" />
  <ModelItem id="Llama-4-Maverick-17B-128E-Instruct" name="llama4-maverick" title="🚀 Meta 最新的 Llama 4 Maverick" />
  <ModelItem id="llama-3.3-70b" name="llama3.3-70b" title="🚀 超快的 Llama 3.3 70b" />
  <ModelItem id="gemini-2.5-flash" name="gemini 2.5 flash" title="Google 最新一代 Gemini" />
  <ModelItem id="gemini-2.5-pro" name="gemini 2.5 pro" title="Google 的推理模型" />
  <ModelItem id="grok-3-mini-beta" name="grok-3-mini-beta" title="⭐ xAI 的推理模型" />
  <ModelItem id="grok-3-beta" name="grok-3-beta" title="⭐ xAI 最新的 Grok 3" />
  <!-- <ModelItem id="internlm/internlm2_5-20b-chat" name="internlm2.5-20b" title="✨ 书生·浦语" /> -->
  <ModelItem id="yi-lightning" name="yi-lightning" title="零一万物" />
  <ModelItem id="kwaipilot/kat-coder-pro:free" name="Kat Coder Pro" title="✨ 快手出品的编程模型" />
  <ModelItem id="meituan/longcat-flash-chat:free" name="LongCat Flash Chat" title="✨ 美团 LongCat 560B MoE" />
  <ModelItem id="alibaba/tongyi-deepresearch-30b-a3b:free" name="Tongyi DeepResearch 30B" title="Tongyi DeepResearch 30B" />
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
