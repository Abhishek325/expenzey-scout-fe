<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";

const reports = [
  {
    id: "weekly-summary",
    title: "Weekly Summary",
    generatedAt: "Jun 13, 2026 • 09:30 AM",
    icon: "fa-calendar-days",
    iconClass: "text-sky-600",
  },
  {
    id: "revenue-analysis",
    title: "Revenue Analysis",
    generatedAt: "Jun 11, 2026 • 09:15 AM",
    icon: "fa-chart-column",
    iconClass: "text-violet-600",
  },
  {
    id: "review-intelligence",
    title: "Review Intelligence",
    generatedAt: "Jun 10, 2026 • 10:45 AM",
    icon: "fa-comment-dots",
    iconClass: "text-rose-500",
  },
  {
    id: "product-performance",
    title: "Product Performance",
    generatedAt: "Jun 8, 2026 • 09:20 AM",
    icon: "fa-box",
    iconClass: "text-indigo-600",
  },
] as const;
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="mb-4 flex items-center justify-between gap-2">
      <h3 class="text-sm font-semibold text-slate-900">Recent AI Reports</h3>
      <RouterLink to="/reports" class="text-sm font-medium text-expenzey-600 hover:text-expenzey-700">
        View All Reports
      </RouterLink>
    </div>
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="report in reports"
        :key="report.id"
        class="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-slate-200 hover:bg-white"
      >
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm"
          :class="report.iconClass"
          aria-hidden="true"
        >
          <FaIcon :icon="report.icon" size="base" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold text-slate-900">{{ report.title }}</p>
          <p class="mt-0.5 text-xs text-slate-500">{{ report.generatedAt }}</p>
          <span
            class="mt-2 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700"
          >
            Completed
          </span>
        </div>
      </article>
    </div>
  </section>
</template>
