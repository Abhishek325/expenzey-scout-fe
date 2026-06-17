<template>
  <div
    class="flex"
    :class="resolvedRole === 'user' ? 'justify-end' : 'justify-start'"
  >
    <div class="flex max-w-[90%] flex-col gap-1.5">
      <div
        class="rounded-xl px-3 py-2 text-sm leading-relaxed"
        :class="
          resolvedRole === 'user'
            ? 'bg-expenzey-50 text-slate-800'
            : 'bg-slate-100 text-slate-700'
        "
      >
        <p v-if="statusText" class="text-slate-500 italic">{{ statusText }}</p>
        <template v-else>
          <template v-for="(segment, index) in segments">
            <button
              v-if="segment.type === 'link' && segment.link"
              :key="`link-${index}`"
              type="button"
              class="font-medium text-expenzey-700 underline decoration-expenzey-300 underline-offset-2 hover:text-expenzey-800"
              @click="onLinkClick(segment.link)"
            >
              {{ segment.value }}
            </button>
            <span v-else :key="`text-${index}`">{{ segment.value }}</span>
          </template>
          <span v-if="streaming" class="inline-block animate-pulse">▍</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { useRouter } from "vue-router";
import { resolveStringKey } from "@/composables/dashboard/resolveStringKey";
import { ROUTES } from "@/constants/routes";
import { CHAT_SERVICE_KEY, type IChatService } from "@/services/chat/IChatService";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";
import type { ChatMessage as ChatMessageModel, ChatRole } from "@/types/chat";
import { buildLinkSegments } from "@/utils/chatLinks";

const props = defineProps<{
  role?: ChatRole;
  content?: string;
  message?: ChatMessageModel;
}>();

const router = useRouter();
const chatService = inject(CHAT_SERVICE_KEY) as IChatService;
const stringService = inject(STRING_SERVICE_KEY) as IStringService;

const resolvedRole = computed(() => props.message?.role ?? props.role ?? "assistant");
const streaming = computed(() => props.message?.streaming ?? false);
const statusText = computed(() => (streaming.value ? props.message?.statusText : null));

const resolvedContent = computed(() => {
  if (props.content) return props.content;
  if (props.message?.content) return props.message.content;
  if (props.message?.contentKey) {
    return resolveStringKey(stringService, props.message.contentKey);
  }
  return "";
});

const segments = computed(() =>
  buildLinkSegments(resolvedContent.value, props.message?.links ?? []),
);

async function onLinkClick(link: NonNullable<typeof segments.value[number]["link"]>) {
  if (link.type === "opportunity") {
    await router.push({ path: ROUTES.OPPORTUNITIES, query: { id: link.id } });
    return;
  }

  const url = link.url ?? (await chatService.getProductLink(link.wcProductId));
  window.open(url, "_blank", "noopener,noreferrer");
}
</script>
