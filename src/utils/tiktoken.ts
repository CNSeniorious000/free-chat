import type { ChatMessage } from '@/types'
import type { Tiktoken } from 'tiktoken'

const countTokensSingleMessage = (encoder: Tiktoken, chatMessage: ChatMessage) => {
  // Calculate the token count, accounting for metadata tokens: im_start, im_end, role/name, and newline
  const metadataTokenCount = 4;
  const messageTokenCount = encoder.encode(chatMessage.content).length;
  return metadataTokenCount + messageTokenCount;
}

export const countTokens = (encoder: Tiktoken | null, messages: ChatMessage[]) => {
  // Ensure the encoder and messages are valid
  if (!encoder || !Array.isArray(messages) || messages.some(msg => typeof msg !== 'object' || msg === null)) {
    throw new Error('Invalid encoder or messages array');
  }
  // Return early if there are no messages
  if (messages.length === 0) return { total: 0 };

  // Use a more descriptive function name and documentation
  const getTokenCountForMessage = countTokensSingleMessage.bind(null, encoder);
  // Batch the token counting for all but the last message (context)
  const contextTokenCounts = messages.slice(0, -1).map(getTokenCountForMessage);
  // Use a batch process instead of individual map calls to optimize performance
  const contextTotalTokens = contextTokenCounts.length > 0 ? contextTokenCounts.reduce((total, count) => total + count, 3) : 3; // Account for metadata tokens
  // Count tokens for the last message separately
  const lastMessage = messages[messages.length - 1];
  const lastMessageTokenCount = lastMessage ? getTokenCountForMessage(lastMessage) : 0;

    // Separate counts for user and assistant messages
    // userMessagesTokenCount: The total number of tokens in all user messages. This can be used for analytics or to limit the number of tokens a user can send.
    // assistantMessagesTokenCount: The total number of tokens in all assistant messages. This can be used for analytics or to limit the number of tokens an assistant can send.
  const userMessagesTokenCount = messages.filter(msg => msg.role === 'user').map(getTokenCountForMessage).reduce((a, b) => a + b, 0);
  const assistantMessagesTokenCount = messages.filter(msg => msg.role === 'assistant').map(getTokenCountForMessage).reduce((a, b) => a + b, 0);
  return {
    contextTotalTokens,
    lastMessageTokenCount,
    userMessagesTokenCount,
    assistantMessagesTokenCount,
    total: contextTotalTokens + lastMessageTokenCount
  };
}

const cl100k_base_json = import.meta.env.PUBLIC_CL100K_BASE_JSON_URL || '/cl100k_base.json'
const tiktoken_bg_wasm = import.meta.env.PUBLIC_TIKTOKEN_BG_WASM_URL || '/tiktoken_bg.wasm'

async function getBPE() {
  return fetch(cl100k_base_json).then(r => r.json())
}

export const initTikToken = async() => {
  const { init } = await import('tiktoken/lite/init')
  const [{ bpe_ranks, special_tokens, pat_str }, { Tiktoken }] = await Promise.all([
    getBPE().catch(console.error),
    import('tiktoken/lite/init'),
    fetch(tiktoken_bg_wasm).then(r => r.arrayBuffer()).then(wasm => init(imports => WebAssembly.instantiate(wasm, imports))),
  ])
  return new Tiktoken(bpe_ranks, special_tokens, pat_str)
}


