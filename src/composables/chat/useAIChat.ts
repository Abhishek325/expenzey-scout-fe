import { computed, inject, onMounted, ref } from "vue";
import followUpPromptsData from "@/data/chat/follow-up-prompts.json";
import suggestedPromptsData from "@/data/chat/suggested-prompts.json";
import { CHAT_SERVICE_KEY, type IChatService } from "@/services/chat/IChatService";
import { USAGE_SERVICE_KEY, type IUsageService } from "@/services/usage/IUsageService";
import { useDateRangeStore } from "@/stores/dateRange";
import type { ChatConversation, ChatMessage } from "@/types/chat";
import type { UsageQuota } from "@/types/usage";
import { shufflePrompts } from "@/utils/chatLinks";

function tempId(): string {
  return `temp-${crypto.randomUUID()}`;
}

export function useAIChat() {
  const chatService = inject(CHAT_SERVICE_KEY) as IChatService;
  const usageService = inject(USAGE_SERVICE_KEY) as IUsageService;
  const dateRangeStore = useDateRangeStore();

  const messages = ref<ChatMessage[]>([]);
  const conversation = ref<ChatConversation | null>(null);
  const conversationId = ref<number | null>(null);
  const suggestedPrompts = ref<string[]>([...suggestedPromptsData]);
  const followUpPrompts = ref<string[]>(shufflePrompts(followUpPromptsData).slice(0, 4));
  const isSending = ref(false);
  const loading = ref(true);
  const usage = ref<UsageQuota | null>(null);
  const statusText = ref<string | null>(null);

  const hasMessages = computed(() => messages.value.length > 0);

  async function loadConversation() {
    const conversations = await chatService.listConversations();
    if (conversations.length > 0) {
      conversation.value = conversations[0];
      conversationId.value = conversations[0].id;
      messages.value = await chatService.getMessages(conversations[0].id);
      return;
    }

    const created = await chatService.createConversation();
    conversation.value = created;
    conversationId.value = created.id;
    messages.value = [];
  }

  async function load() {
    loading.value = true;
    try {
      const [, quota] = await Promise.all([
        loadConversation(),
        usageService.getUsage(),
      ]);
      usage.value = quota;
    } finally {
      loading.value = false;
    }
  }

  async function newConversation() {
    const created = await chatService.createConversation();
    conversation.value = created;
    conversationId.value = created.id;
    messages.value = [];
    followUpPrompts.value = shufflePrompts(followUpPromptsData).slice(0, 4);
  }

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || isSending.value) return;

    isSending.value = true;
    statusText.value = null;
    followUpPrompts.value = shufflePrompts(followUpPromptsData).slice(0, 4);

    const assistantId = tempId();
    let userMessageId = tempId();

    messages.value = [
      ...messages.value,
      {
        id: userMessageId,
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      },
    ];

    messages.value = [
      ...messages.value,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        streaming: true,
        createdAt: new Date().toISOString(),
      },
    ];

    try {
      const result = await chatService.sendMessage(trimmed, {
        conversationId: conversationId.value ?? undefined,
        start: dateRangeStore.start.toISOString(),
        end: dateRangeStore.end.toISOString(),
        onStatus: (text) => {
          statusText.value = text;
          const idx = messages.value.findIndex((m) => m.id === assistantId);
          if (idx >= 0) {
            messages.value[idx] = { ...messages.value[idx], statusText: text };
          }
        },
        onToken: (token) => {
          const idx = messages.value.findIndex((m) => m.id === assistantId);
          if (idx >= 0) {
            const current = messages.value[idx].content ?? "";
            messages.value[idx] = {
              ...messages.value[idx],
              content: current + token,
              statusText: undefined,
            };
          }
        },
      });

      conversationId.value = result.conversationId;
      if (result.suggestedTitle && conversation.value) {
        conversation.value = {
          ...conversation.value,
          id: result.conversationId,
          title: result.suggestedTitle,
        };
      }

      const idx = messages.value.findIndex((m) => m.id === assistantId);
      if (idx >= 0) {
        messages.value[idx] = {
          ...result.message,
          streaming: false,
          statusText: undefined,
        };
      }

      if (usage.value) {
        usage.value = {
          ...usage.value,
          chat: { ...usage.value.chat, used: usage.value.chat.used + 1 },
        };
      }
    } catch (error) {
      const idx = messages.value.findIndex((m) => m.id === assistantId);
      if (idx >= 0) {
        messages.value[idx] = {
          ...messages.value[idx],
          content: error instanceof Error ? error.message : "Chat failed",
          streaming: false,
          statusText: undefined,
        };
      }
    } finally {
      isSending.value = false;
      statusText.value = null;
    }
  }

  async function copyMessage(content: string) {
    if (!content) return;
    await navigator.clipboard.writeText(content);
  }

  onMounted(load);

  return {
    messages,
    conversation,
    conversationId,
    suggestedPrompts,
    followUpPrompts,
    prompts: suggestedPrompts,
    hasMessages,
    isSending,
    sending: isSending,
    loading,
    usage,
    statusText,
    sendMessage,
    send: sendMessage,
    copyMessage,
    newConversation,
    reload: load,
  };
}
