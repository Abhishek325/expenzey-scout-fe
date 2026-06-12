<script setup lang="ts">
import { useAIChat } from "@/composables/chat/useAIChat";
import ChatMessage from "@/components/chat/ChatMessage.vue";
import SuggestedPromptChips from "@/components/chat/SuggestedPromptChips.vue";
import ChatInput from "@/components/chat/ChatInput.vue";
import UsageQuotaFooter from "@/components/shared/UsageQuotaFooter.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";

const title = useLocalizedString("chat", "title");
const subtitle = useLocalizedString("chat", "subtitle");

const { messages, sendMessage, isSending, suggestedPrompts } = useAIChat();

function onSend(content: string) {
  void sendMessage(content);
}

function onPrompt(prompt: string) {
  void sendMessage(prompt);
}
</script>

<template>
  <div class="flex min-h-[calc(100vh-8rem)] flex-col gap-4">
    <header>
      <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
      <p class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
    </header>

    <div class="flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div class="flex-1 space-y-4 overflow-y-auto p-5">
        <ChatMessage v-for="message in messages" :key="message.id" :message="message" />
      </div>
      <div class="border-t border-gray-100 bg-gray-50 p-4">
        <SuggestedPromptChips :prompts="suggestedPrompts" @select="onPrompt" />
        <ChatInput class="mt-3" :disabled="isSending" @send="onSend" />
      </div>
    </div>

    <UsageQuotaFooter feature="chat" />
  </div>
</template>
