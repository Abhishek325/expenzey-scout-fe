<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";

const { disabled = false, compact = false } = defineProps<{
  disabled?: boolean;
  compact?: boolean;
}>();
const emit = defineEmits<{ generate: []; click: [] }>();
const label = useLocalizedString("dashboard", "generateAiReport");

function onClick() {
  emit("generate");
  emit("click");
}
</script>

<template>
  <button
    type="button"
    class="inline-flex w-full min-w-0 items-center justify-center gap-1.5 rounded-lg bg-expenzey-500 px-3 font-semibold text-white shadow-sm transition hover:bg-expenzey-600 disabled:cursor-not-allowed disabled:opacity-60"
    :class="compact ? 'py-1.5 text-xs' : 'gap-2 py-2.5 text-sm'"
    :disabled="disabled"
    @click="onClick"
  >
    <FaIcon v-if="!compact" icon="fa-wand-magic-sparkles" size="sm" />
    {{ label }}
    <FaIcon v-if="compact" icon="fa-wand-magic-sparkles" size="xs" />
  </button>
</template>
