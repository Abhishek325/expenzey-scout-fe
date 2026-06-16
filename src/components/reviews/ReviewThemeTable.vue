<template>
  <article class="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ title }}</p>
    <div class="mt-3 overflow-x-auto">
      <table class="min-w-full text-left text-sm">
        <thead>
          <tr class="border-b border-slate-100 text-xs text-slate-500">
            <th class="pb-2 pr-3 font-medium">{{ themeColumn }}</th>
            <th class="pb-2 pr-3 font-medium">{{ mentionsColumn }}</th>
            <th class="pb-2 font-medium">{{ percentColumn }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.theme"
            class="border-b border-slate-50 last:border-0"
          >
            <td class="py-2.5 pr-3 font-medium text-slate-800">{{ row.label }}</td>
            <td class="py-2.5 pr-3 text-slate-600">{{ row.count }}</td>
            <td class="py-2.5">
              <div class="flex items-center gap-2">
                <div class="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    class="h-full rounded-full"
                    :class="barClass"
                    :style="{ width: `${row.percent}%` }"
                  />
                </div>
                <span class="w-10 shrink-0 text-right text-xs text-slate-600">{{ row.percent }}%</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="rows.length === 0" class="py-4 text-sm text-slate-400">{{ emptyLabel }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLocalizedString } from "@/composables/useLocalizedString";

const props = withDefaults(
  defineProps<{
    title: string;
    rows: Array<{ theme: string; label: string; count: number; percent: number }>;
    variant?: "positive" | "complaint";
  }>(),
  { variant: "positive" },
);

const themeColumn = useLocalizedString("reviews", "detail.table.theme");
const mentionsColumn = useLocalizedString("reviews", "detail.table.mentions");
const percentColumn = useLocalizedString("reviews", "detail.table.percent");
const emptyLabel = useLocalizedString("reviews", "detail.noThemes");

const barClass = computed(() =>
  props.variant === "positive" ? "bg-emerald-500" : "bg-rose-500",
);
</script>
