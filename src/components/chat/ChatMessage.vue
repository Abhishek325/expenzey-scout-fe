<script setup lang="ts">
import { computed, inject } from "vue";
import { resolveStringKey } from "@/composables/dashboard/resolveStringKey";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";
import type { ChatMessage as ChatMessageModel, ChatRole } from "@/types/chat";

const props = defineProps<{
  role?: ChatRole;
  content?: string;
  message?: ChatMessageModel;
}>();

const stringService = inject(STRING_SERVICE_KEY) as IStringService;

const resolvedRole = computed(() => props.message?.role ?? props.role ?? "assistant");

const resolvedContent = computed(() => {
  if (props.content) {
    return props.content;
  }
  if (props.message?.content) {
    return props.message.content;
  }
  if (props.message?.contentKey) {
    return resolveStringKey(stringService, props.message.contentKey);
  }
  return "";
});
</script>

<template>
  <div
    class="flex"
    :class="resolvedRole === 'user' ? 'justify-end' : 'justify-start'"
  >
    <div
      class="max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed"
      :class="
        resolvedRole === 'user'
          ? 'bg-expenzey-50 text-slate-800'
          : 'bg-slate-100 text-slate-700'
      "
    >
      {{ resolvedContent }}
    </div>
  </div>
</template>
