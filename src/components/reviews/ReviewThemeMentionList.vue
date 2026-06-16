<template>
  <article class="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
    <p class="text-xs font-semibold uppercase tracking-wide" :class="titleClass">{{ title }}</p>
    <ul class="mt-3 flex flex-1 flex-col gap-2">
      <li
        v-for="item in items"
        :key="item.theme"
        class="flex items-center justify-between gap-3 text-sm text-slate-700"
      >
        <span class="flex min-w-0 items-center gap-2">
          <span
            class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white"
            :class="iconClass"
            aria-hidden="true"
          >
            <FaIcon :icon="icon" size="xs" />
          </span>
          <span class="truncate">{{ item.label }}</span>
        </span>
        <span class="shrink-0 text-xs text-slate-500">{{ item.count }} {{ mentionsLabel }}</span>
      </li>
    </ul>
    <p v-if="items.length === 0" class="mt-3 text-sm text-slate-400">{{ emptyLabel }}</p>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import { useLocalizedString } from "@/composables/useLocalizedString";

const props = withDefaults(
  defineProps<{
    title: string;
    items: Array<{ theme: string; label: string; count: number }>;
    variant?: "positive" | "complaint";
  }>(),
  { variant: "positive" },
);

const mentionsLabel = useLocalizedString("reviews", "detail.mentions");
const emptyLabel = useLocalizedString("reviews", "detail.noThemes");

const titleClass = computed(() =>
  props.variant === "positive" ? "text-emerald-600" : "text-rose-500",
);
const iconClass = computed(() =>
  props.variant === "positive" ? "bg-emerald-500" : "bg-rose-500",
);
const icon = computed(() =>
  props.variant === "positive" ? "fa-check" : "fa-exclamation",
);
</script>
