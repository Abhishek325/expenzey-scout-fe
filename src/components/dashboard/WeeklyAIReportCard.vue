<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import GenerateReportButton from "@/components/dashboard/GenerateReportButton.vue";

const reportPeriod = "Week of Jun 7 – Jun 13, 2026";

const sections = [
  {
    label: "Revenue",
    value: "₹432",
    trend: "↑ 12% vs last week",
    trendClass: "text-emerald-600",
    icon: "fa-arrows-rotate",
    iconClass: "bg-sky-100 text-sky-600",
  },
  {
    label: "Top Product",
    value: "Brand Buttons",
    detail: "₹89.91 (20.8% of revenue)",
    icon: "fa-calendar-days",
    iconClass: "bg-violet-100 text-violet-600",
  },
  {
    label: "Customer Trend",
    value: "Returning customers",
    trend: "↑ 8% vs last week",
    trendClass: "text-emerald-600",
    icon: "fa-user-group",
    iconClass: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Main Risk",
    value: "Mens Divi Hoodie sales declined",
    trend: "↓ 10% vs last week",
    trendClass: "text-rose-600",
    icon: "fa-triangle-exclamation",
    iconClass: "bg-rose-100 text-rose-600",
  },
] as const;

const recommendedAction =
  "Create a bundle with Brand Buttons & Divi Tee. Potential impact: +₹3,500.";
</script>

<template>
  <section class="flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
    <div class="shrink-0 border-b border-slate-100 px-4 py-3">
      <div class="flex items-center gap-2">
        <FaIcon icon="fa-calendar-days" size="sm" icon-class="text-slate-400" />
        <div>
          <h3 class="text-sm font-semibold text-slate-900">Weekly AI Report</h3>
          <p class="mt-0.5 text-xs text-slate-500">{{ reportPeriod }}</p>
        </div>
      </div>
    </div>
    <div class="min-h-0 flex-1 overflow-y-auto p-4">
      <div class="flex flex-col gap-3">
        <div
          v-for="section in sections"
          :key="section.label"
          class="flex gap-3 rounded-lg bg-slate-50 px-3 py-2.5"
        >
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            :class="section.iconClass"
            aria-hidden="true"
          >
            <FaIcon :icon="section.icon" size="sm" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">{{ section.label }}</p>
            <p class="mt-0.5 text-sm font-semibold text-slate-900">{{ section.value }}</p>
            <p v-if="'detail' in section && section.detail" class="text-xs text-slate-600">
              {{ section.detail }}
            </p>
            <p
              v-if="'trend' in section && section.trend"
              class="mt-0.5 text-xs font-medium"
              :class="section.trendClass"
            >
              {{ section.trend }}
            </p>
          </div>
        </div>
        <div class="flex gap-3 rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2.5">
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600"
            aria-hidden="true"
          >
            <FaIcon icon="fa-magnifying-glass" size="sm" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium uppercase tracking-wide text-indigo-400">Recommended Action</p>
            <p class="mt-1 text-sm leading-relaxed text-slate-700">{{ recommendedAction }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex shrink-0 flex-col gap-2 border-t border-slate-100 p-4">
      <RouterLink
        to="/reports"
        class="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        View Full Report
      </RouterLink>
      <GenerateReportButton />
    </div>
  </section>
</template>
