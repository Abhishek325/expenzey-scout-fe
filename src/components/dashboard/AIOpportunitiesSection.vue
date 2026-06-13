<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import { INSIGHTS_ROW_HEIGHT } from "@/constants/dashboardRowHeights";

const opportunities = [
  {
    id: "high-impact",
    badge: "High Impact",
    badgeClass: "bg-violet-100 text-violet-700",
    badgeIcon: "fa-fire",
    title: "Protein Powder revenue grew 28% this week.",
    recommendation: "Increase inventory for this product.",
    impact: "Estimated impact: +₹3,500",
    productName: "Protein Powder",
    imageClass: "bg-slate-800",
  },
  {
    id: "quick-win",
    badge: "Quick Win",
    badgeClass: "bg-emerald-100 text-emerald-700",
    badgeIcon: "fa-bolt",
    title: "32% of customers who bought Brand Buttons also bought Divi Tee.",
    recommendation: "Create a bundle offer to increase AOV.",
    impact: "",
    productName: "Divi Tee",
    imageClass: "bg-emerald-600",
  },
] as const;
</script>

<template>
  <section
    class="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm"
    :class="INSIGHTS_ROW_HEIGHT"
  >
    <div class="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-2.5">
      <h3 class="text-sm font-semibold text-slate-900">AI Opportunities</h3>
      <RouterLink to="/reports" class="text-xs font-medium text-indigo-600 hover:text-indigo-700">
        View All
      </RouterLink>
    </div>
    <div class="min-h-0 flex-1 overflow-y-auto p-4">
      <div class="flex flex-col gap-3">
        <article
          v-for="item in opportunities"
          :key="item.id"
          class="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3"
        >
          <div
            class="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white"
            :class="item.imageClass"
            aria-hidden="true"
          >
            {{ item.productName.charAt(0) }}
          </div>
          <div class="min-w-0 flex-1">
            <span
              class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              :class="item.badgeClass"
            >
              <FaIcon :icon="item.badgeIcon" size="xs" />
              {{ item.badge }}
            </span>
            <p class="mt-1.5 text-sm leading-relaxed text-slate-700">{{ item.title }}</p>
            <p class="mt-1 text-sm text-slate-600">
              <span class="font-medium text-slate-800">Recommendation:</span>
              {{ item.recommendation }}
            </p>
            <p v-if="item.impact" class="mt-1 text-xs font-medium text-emerald-600">{{ item.impact }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
