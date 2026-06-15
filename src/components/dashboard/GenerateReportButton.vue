<template>
  <button
    type="button"
    class="inline-flex min-w-0 items-center justify-center gap-2 rounded-lg bg-expenzey-500 font-semibold text-white shadow-sm transition hover:bg-expenzey-600 disabled:cursor-not-allowed disabled:opacity-60"
    :class="[
      compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm',
    ]"
    :disabled="disabled"
    @click="onClick"
  >
    <FaIcon icon="fa-wand-magic-sparkles" :size="compact ? 'xs' : 'sm'" />
    {{ label }}
    <FaIcon v-if="showArrow" icon="fa-arrow-right" size="xs" />
  </button>
</template>

<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";

const {
  disabled = false,
  compact = false,
  fullWidth = true,
  showArrow = false,
  labelKey = "reports.generateNow",
} = defineProps<{
  disabled?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
  showArrow?: boolean;
  labelKey?: string;
}>();
const emit = defineEmits<{ generate: []; click: [] }>();

const contextKey = labelKey.includes(".") ? labelKey.split(".")[0] : "reports";
const stringKey = labelKey.includes(".") ? labelKey.split(".").slice(1).join(".") : labelKey;
const label = useLocalizedString(contextKey, stringKey);

function onClick() {
  emit("generate");
  emit("click");
}
</script>
