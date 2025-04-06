<script lang="ts">
  import ModelItem from './ModelItem.svelte'
  import Hr from './Hr.svelte'
</script>

<div class="grid grid-cols-2 w-full justify-between gap-1.5 text-sm">
  <ModelItem id="deepseek-r1-distill-qwen-32b" name="deepseek-r1-qwen-32b" title="🧠 DeepSeek 的推理模型 R1" />
  <ModelItem id="DeepSeek-R1-Distill-Llama-70B" name="deepseek-r1-llama-70b" title="🧠 DeepSeek 的推理模型 R1" />
  <ModelItem id="qwen-qwq-32b" name="qwen-qwq-32b" title="⭐ Qwen 最新的推理模型 QwQ 正式版" />
  <ModelItem id="DeepSeek-V3-0324" name="deepseek-v3" title="✨ 深度求索最新发布的 DeepSeek v3" />
  <ModelItem id="llama-3.3-70b" name="llama3.3-70b" title="🚀 超快的 Llama 3.3 70b" />
  <ModelItem id="meta-llama/llama-4-scout-17b-16e-instruct" name="llama4-scout" title="🚀 Meta 最新发布的 Llama 4 Scout" />
  <ModelItem id="grok-2-1212" name="grok-2-1212" title="🚀 xAI 的第二代 Grok" />
  <ModelItem id="gemma-3-27b-it" name="gemma 3" title="Google 最新的开源模型" />
  <ModelItem id="gemini-2.0-flash-lite" name="gemini 2.0 flash lite" title="Google 最新一代 Gemini" />
  <ModelItem id="gemini-2.0-flash-thinking-exp" name="gemini 2.0 flash thinking" title="Google 的推理模型" />
  <!-- <ModelItem id="internlm/internlm2_5-20b-chat" name="internlm2.5-20b" title="✨ 书生·浦语" /> -->
  <ModelItem id="yi-lightning" name="yi-lightning" title="⭐ 零一万物的霸榜 SOTA 模型" />
  <ModelItem id="THUDM/glm-4-9b-chat" name="glm-4-9b-chat" title="✨ 智谱 AI" />
  <Hr text="低可用性模型（延迟较大）" />
  <ModelItem id="azure:gpt-4o" name="gpt-4o" title="GPT 4o (Azure)" />
  <ModelItem id="Mistral-small-2503" name="Mistral-Small" title="Mistral 最新发布的轻快版" />
  <ModelItem id="Mistral-large-2411" name="Mistral-large" title="Mistral 旗舰款" />
  <!-- <ModelItem id="Phi-3.5-MoE-instruct" name="Phi-3.5-MoE-instruct" title="微软的开源模型" /> -->
  <!-- <ModelItem id="Meta-Llama-3.1-405B-Instruct" name="llama-3.1-405b" title="Llama-3.1 405B 超大杯" /> -->
  <ModelItem id="Phi-4" name="Phi 4" title="微软 Phi 系列最新款" />
</div>
