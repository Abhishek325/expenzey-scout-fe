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

const { messages, prompts, usage, send } = useAIChat({ limitMessages: 4 });
const widgetTitle = useLocalizedString("dashboard", "chatWidgetTitle");
const greeting = useLocalizedString("chat", "greetingDefault");
const viewHistory = useLocalizedString("dashboard", "viewHistory");

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
  <section class="flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
    <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
      <h3 class="text-sm font-semibold text-slate-900">{{ widgetTitle }}</h3>
      <RouterLink to="/chat" class="text-sm font-medium text-expenzey-600 hover:text-expenzey-700">{{ viewHistory }}</RouterLink>
    </div>
    <div class="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
      <div class="rounded-xl bg-slate-100 p-3 text-sm text-slate-600">
        {{ greeting }}
      </div>
      <SuggestedPromptChips :prompts="prompts.slice(0, 4)" @select="onSend" />
      <ChatMessage
        v-for="msg in displayMessages"
        :key="msg.id"
        :role="msg.role"
        :content="msg.text"
      />
    </div>
    <div class="border-t border-slate-100 p-4">
      <ChatInput @send="onSend" />
      <UsageQuotaFooter
        v-if="usage"
        class="mt-3"
        :used="usage.chat.used"
        :limit="usage.chat.limit"
      />
    </div>
  </section>
</template>
