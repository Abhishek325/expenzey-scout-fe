<template>
  <div class="flex items-center gap-2">
    <input
      v-model="draft"
      type="text"
      :disabled="disabled"
      class="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-expenzey-500 focus:outline-none focus:ring-2 focus:ring-expenzey-100 disabled:cursor-not-allowed disabled:bg-slate-50"
      :placeholder="placeholder"
      @keydown.enter.prevent="submit"
    />
    <button
      type="button"
      :disabled="disabled"
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-expenzey-500 text-white transition hover:bg-expenzey-600 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="Send message"
      @click="submit"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 12h14M12 5l7 7-7 7"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useLocalizedString } from "@/composables/useLocalizedString";

const props = defineProps<{
  disabled?: boolean;
  initialPrompt?: string | null;
}>();

const emit = defineEmits<{ send: [message: string] }>();

const draft = ref("");
const placeholder = useLocalizedString("chat", "inputPlaceholder");

watch(
  () => props.initialPrompt,
  (value) => {
    if (value) {
      draft.value = value;
    }
  },
  { immediate: true },
);

function submit() {
  if (!draft.value.trim()) {
    return;
  }
  emit("send", draft.value);
  draft.value = "";
}
</script>
