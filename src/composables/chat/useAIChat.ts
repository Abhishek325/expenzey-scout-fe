import { inject, onMounted, ref } from "vue";
import suggestedPromptsData from "@/data/chat/suggested-prompts.json";
import { CHAT_SERVICE_KEY, type IChatService } from "@/services/chat/IChatService";
import { USAGE_SERVICE_KEY, type IUsageService } from "@/services/usage/IUsageService";
import type { ChatMessage } from "@/types/chat";
import type { UsageQuota } from "@/types/usage";

export function useAIChat(options?: { limitMessages?: number }) {
  const chatService = inject(CHAT_SERVICE_KEY) as IChatService;
  const usageService = inject(USAGE_SERVICE_KEY) as IUsageService;
  const messages = ref<ChatMessage[]>([]);
  const suggestedPrompts = ref<string[]>([...suggestedPromptsData]);
  const isSending = ref(false);
  const loading = ref(true);
  const usage = ref<UsageQuota | null>(null);

  async function load() {
    loading.value = true;
    try {
      const [history, quota] = await Promise.all([
        chatService.getMessages(),
        usageService.getUsage(),
      ]);
      const limit = options?.limitMessages;
      messages.value = limit ? history.slice(-limit) : history;
      usage.value = quota;
    } finally {
      loading.value = false;
    }
  }

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || isSending.value) {
      return;
    }
    isSending.value = true;
    try {
      const reply = await chatService.sendMessage(trimmed);
      messages.value = [...messages.value, reply];
      if (usage.value) {
        usage.value = {
          ...usage.value,
          chat: { ...usage.value.chat, used: usage.value.chat.used + 1 },
        };
      }
    } finally {
      isSending.value = false;
    }
  }

  onMounted(load);

  return {
    messages,
    suggestedPrompts,
    prompts: suggestedPrompts,
    isSending,
    sending: isSending,
    loading,
    usage,
    sendMessage,
    send: sendMessage,
    reload: load,
  };
}
