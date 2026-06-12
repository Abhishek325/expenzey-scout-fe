<script setup lang="ts">
import { useLocalizedString } from "@/composables/useLocalizedString";

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
    class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-expenzey-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-expenzey-600"
    @click="onClick"
  >
    <span aria-hidden="true">✨</span>
    {{ label }}
  </button>
</template>
