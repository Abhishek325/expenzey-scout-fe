<template>
  <div class="flex max-w-full gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <button
      v-for="(prompt, index) in prompts"
      :key="`${index}-${prompt}`"
      type="button"
      class="shrink-0 whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 py-1 text-left text-[9px] leading-none text-slate-600 transition hover:border-expenzey-300 hover:bg-expenzey-50 hover:text-expenzey-700"
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
