<template>
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
    <div
      v-for="card in cards"
      :key="card.key"
      class="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <span
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        :class="card.iconClass"
        aria-hidden="true"
      >
        <FaIcon :icon="card.icon" size="base" />
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-2xl font-semibold leading-none text-slate-900">{{ card.value }}</p>
        <p class="mt-1.5 text-sm font-medium text-slate-700">{{ card.title }}</p>
        <p class="mt-0.5 text-xs text-slate-500">{{ card.footer }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import { useFormatCurrency } from "@/composables/useFormatCurrency";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";

const props = defineProps<{
  total: number;
  highImpact: number;
  quickWins: number;
  needsAttention: number;
  estimatedImpact: number;
}>();

const copy = useReactiveLocaleStringRecord("opportunities", [
  "summary.total",
  "summary.totalFooter",
  "summary.highImpact",
  "summary.highImpactFooter",
  "summary.quickWins",
  "summary.quickWinsFooter",
  "summary.needsAttention",
  "summary.needsAttentionFooter",
  "summary.estimatedImpact",
  "summary.additionalRevenue",
] as const);

const { formatCurrency } = useFormatCurrency();

const cards = computed(() => [
  {
    key: "total",
    value: String(props.total),
    title: copy.value["summary.total"],
    footer: copy.value["summary.totalFooter"],
    icon: "fa-clipboard-list",
    iconClass: "bg-violet-100 text-violet-600",
  },
  {
    key: "highImpact",
    value: String(props.highImpact),
    title: copy.value["summary.highImpact"],
    footer: copy.value["summary.highImpactFooter"],
    icon: "fa-fire",
    iconClass: "bg-rose-100 text-rose-600",
  },
  {
    key: "quickWins",
    value: String(props.quickWins),
    title: copy.value["summary.quickWins"],
    footer: copy.value["summary.quickWinsFooter"],
    icon: "fa-bolt",
    iconClass: "bg-orange-100 text-orange-600",
  },
  {
    key: "needsAttention",
    value: String(props.needsAttention),
    title: copy.value["summary.needsAttention"],
    footer: copy.value["summary.needsAttentionFooter"],
    icon: "fa-chart-column",
    iconClass: "bg-sky-100 text-sky-600",
  },
  {
    key: "estimatedImpact",
    value: props.estimatedImpact > 0 ? formatCurrency(props.estimatedImpact) : "—",
    title: copy.value["summary.estimatedImpact"],
    footer: copy.value["summary.additionalRevenue"],
    icon: "fa-arrow-trend-up",
    iconClass: "bg-emerald-100 text-emerald-600",
  },
]);
</script>
