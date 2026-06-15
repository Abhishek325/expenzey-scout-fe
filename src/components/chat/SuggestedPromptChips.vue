<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="(prompt, index) in prompts"
      :key="`${index}-${prompt}`"
      type="button"
      class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left text-xs text-slate-600 transition hover:border-expenzey-300 hover:bg-expenzey-50 hover:text-expenzey-700"
      @click="emit('select', prompt)"
    >
      {{ prompt }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  prompts: string[];
}>();

const emit = defineEmits<{ select: [prompt: string] }>();
</script>
