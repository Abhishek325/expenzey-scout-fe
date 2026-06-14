<script setup lang="ts">
import { computed, inject } from "vue";
import ChatInput from "@/components/chat/ChatInput.vue";
import ChatMessage from "@/components/chat/ChatMessage.vue";
import SuggestedPromptChips from "@/components/chat/SuggestedPromptChips.vue";
import UsageQuotaFooter from "@/components/shared/UsageQuotaFooter.vue";
import { useAIChat } from "@/composables/chat/useAIChat";
import { useLocalizedString } from "@/composables/useLocalizedString";
import { resolveStringKey } from "@/composables/dashboard/resolveStringKey";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";

const { floating = false, initialPrompt = null } = defineProps<{
  floating?: boolean;
  initialPrompt?: string | null;
}>();

const emit = defineEmits<{ close: [] }>();

const { messages, prompts, usage, send } = useAIChat({ limitMessages: 4 });
const widgetTitle = useLocalizedString("dashboard", "chatWidgetTitle");
const greeting = useLocalizedString("chat", "greetingDefault");
const closeLabel = useLocalizedString("chat", "closeChat");

const stringService = inject(STRING_SERVICE_KEY) as IStringService;

const displayMessages = computed(() =>
  messages.value.map((m) => ({
    ...m,
    text: m.content ?? (m.contentKey ? resolveStringKey(stringService, m.contentKey) : ""),
  }))
);

async function onSend(text: string) {
  await send(text);
}
</script>

<template>
  <section
    class="flex min-h-0 flex-col bg-white"
    :class="floating ? 'h-full' : 'h-full rounded-xl border border-slate-200 shadow-sm'"
  >
    <div class="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
      <h3 class="text-sm font-semibold text-slate-900">{{ widgetTitle }}</h3>
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
    <div class="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
      <div class="rounded-xl bg-slate-100 p-3 text-sm text-slate-600">
        {{ greeting }}
      </div>
      <SuggestedPromptChips :prompts="prompts" @select="onSend" />
      <ChatMessage
        v-for="msg in displayMessages"
        :key="msg.id"
        :role="msg.role"
        :content="msg.text"
      />
    </div>
    <div class="shrink-0 border-t border-slate-100 p-4">
      <ChatInput :initial-prompt="initialPrompt" @send="onSend" />
      <UsageQuotaFooter
        v-if="usage"
        class="mt-3"
        :used="usage.chat.used"
        :limit="usage.chat.limit"
      />
    </div>
  </section>
</template>
