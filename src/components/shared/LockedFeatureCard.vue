<template>
  <article
    class="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4"
  >
    <span class="text-lg" aria-hidden="true">🔒</span>
    <div class="min-w-0 flex-1">
      <p class="text-sm font-semibold text-slate-700">{{ title }}</p>
      <p v-if="subtitle" class="mt-0.5 text-xs text-slate-500">{{ subtitle }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>
