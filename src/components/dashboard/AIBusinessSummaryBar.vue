<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";

const highlights = [
  {
    id: "revenue",
    label: "Revenue increased",
    detail: "12% vs last week",
    icon: "fa-arrow-trend-up",
    iconClass: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "top-performer",
    label: "Top Performer",
    detail: "Brand Buttons | ₹89.91 ↑ 12.5%",
    icon: "fa-trophy",
    iconClass: "bg-amber-100 text-amber-600",
  },
  {
    id: "needs-attention",
    label: "Needs Attention",
    detail: "Mens Divi Hoodie | Sales ↓ 10%",
    icon: "fa-triangle-exclamation",
    iconClass: "bg-rose-100 text-rose-600",
  },
  {
    id: "opportunity",
    label: "Top Opportunity",
    detail: "Bundle with top products | Potential revenue +₹3,500",
    icon: "fa-lightbulb",
    iconClass: "bg-sky-100 text-sky-600",
  },
] as const;
</script>

<template>
  <section class="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-violet-50/60 p-5 shadow-sm">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <span
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-expenzey-600 text-white shadow-sm"
          aria-hidden="true"
        >
          <FaIcon icon="fa-robot" size="base" />
        </span>
        <h2 class="text-sm font-semibold text-slate-900">AI Business Summary</h2>
      </div>
      <RouterLink
        to="/reports"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-expenzey-600 hover:text-expenzey-700"
      >
        View Full Report
        <FaIcon icon="fa-arrow-right" size="xs" />
      </RouterLink>
    </div>
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="item in highlights"
        :key="item.id"
        class="flex items-start gap-3 rounded-lg border border-white/80 bg-white/70 px-4 py-3 backdrop-blur-sm"
      >
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          :class="item.iconClass"
          aria-hidden="true"
        >
          <FaIcon :icon="item.icon" size="sm" />
        </span>
        <div class="min-w-0">
          <p class="text-xs font-medium text-slate-500">{{ item.label }}</p>
          <p class="mt-0.5 text-sm font-semibold leading-snug text-slate-900">{{ item.detail }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
