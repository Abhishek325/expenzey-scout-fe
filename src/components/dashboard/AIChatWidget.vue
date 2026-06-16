<template>
  <section
    class="flex min-h-0 flex-col bg-white"
    :class="floating ? 'h-full' : 'h-full rounded-xl border border-slate-200 shadow-sm'"
  >
    <div class="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
      <div class="min-w-0">
        <h3 class="truncate text-sm font-semibold text-slate-900">{{ headerTitle }}</h3>
      </div>
      <div class="flex shrink-0 items-center gap-1">
        <button
          type="button"
          class="rounded-lg px-2 py-1 text-xs font-medium text-expenzey-700 hover:bg-expenzey-50"
          :disabled="isSending"
          @click="onNewConversation"
        >
          {{ clearChatLabel }}
        </button>
        <button
          v-if="floating"
          type="button"
          class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          :aria-label="closeLabel"
          @click="emit('close')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div ref="scrollContainer" class="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
      <div v-if="loading" class="text-sm text-slate-500">{{ loadingLabel }}</div>
      <template v-else>
        <div
          v-if="!hasMessages"
          class="rounded-xl bg-slate-100 p-3 text-sm text-slate-600"
        >
          {{ greeting }}
        </div>
        <SuggestedPromptChips
          v-if="!hasMessages"
          :prompts="prompts"
          @select="onSend"
        />
        <ChatMessage
          v-for="msg in messages"
          :key="msg.id"
          :message="msg"
        />
      </template>
    </div>

    <div class="shrink-0 border-t border-slate-100 p-4">
      <SuggestedPromptChips
        v-if="hasMessages && !isSending"
        class="mb-3"
        :prompts="followUpPrompts"
        @select="onSend"
      />
      <ChatInput
        :disabled="isSending || loading"
        :initial-prompt="initialPrompt"
        @send="onSend"
      />
      <p class="mt-2 text-[11px] leading-relaxed text-slate-400">{{ privacyNote }}</p>
      <UsageQuotaFooter
        v-if="usage"
        class="mt-3"
        :used="usage.chat.used"
        :limit="usage.chat.limit"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import ChatInput from "@/components/chat/ChatInput.vue";
import ChatMessage from "@/components/chat/ChatMessage.vue";
import SuggestedPromptChips from "@/components/chat/SuggestedPromptChips.vue";
import UsageQuotaFooter from "@/components/shared/UsageQuotaFooter.vue";
import { useAIChat } from "@/composables/chat/useAIChat";
import { useLocalizedString } from "@/composables/useLocalizedString";

const { floating = false, initialPrompt = null } = defineProps<{
  floating?: boolean;
  initialPrompt?: string | null;
}>();

const emit = defineEmits<{ close: [] }>();

const {
  messages,
  conversation,
  prompts,
  followUpPrompts,
  hasMessages,
  isSending,
  loading,
  usage,
  send,
  newConversation,
} = useAIChat();

const scrollContainer = ref<HTMLElement | null>(null);

const widgetTitle = useLocalizedString("chat", "widgetTitle");
const headerTitle = computed(() => widgetTitle.value);
const conversationTitle = computed(() => conversation.value?.title ?? "");
const greeting = useLocalizedString("chat", "greetingDefault");
const closeLabel = useLocalizedString("chat", "closeChat");
const clearChatLabel = useLocalizedString("chat", "clearChat");
const privacyNote = useLocalizedString("chat", "privacyNote");
const loadingLabel = useLocalizedString("common", "loading");

async function onSend(text: string) {
  await send(text);
  await nextTick();
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  }
}

async function onNewConversation() {
  await newConversation();
}

watch(
  () => messages.value.length,
  async () => {
    await nextTick();
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
    }
  },
);
</script>
