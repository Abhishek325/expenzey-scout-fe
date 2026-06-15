<template>
  <section class="rounded-xl border border-slate-200 bg-white shadow-sm">
    <div class="border-b border-slate-100 px-4 py-3">
      <h3 class="text-sm font-semibold text-slate-900">{{ title }}</h3>
    </div>
    <div v-if="loading" class="px-4 py-6 text-sm text-slate-500">Loading snapshot…</div>
    <ul v-else class="divide-y divide-slate-100">
      <li v-if="snapshot?.bestPerformingProduct" class="px-4 py-3">
        <p class="text-xs font-medium uppercase tracking-wide text-emerald-600">{{ bestLabel }}</p>
        <p class="mt-1 text-sm font-semibold text-slate-900">{{ snapshot.bestPerformingProduct.name }}</p>
        <p class="text-xs text-slate-500">
          {{ formatCurrency(snapshot.bestPerformingProduct.revenue) }}
          · ↑ {{ snapshot.bestPerformingProduct.growthPercent }}%
        </p>
      </li>
      <li v-if="snapshot?.needsAttentionProduct" class="px-4 py-3">
        <p class="text-xs font-medium uppercase tracking-wide text-rose-600">{{ attentionLabel }}</p>
        <p class="mt-1 text-sm font-semibold text-slate-900">{{ snapshot.needsAttentionProduct.name }}</p>
        <p class="text-xs text-slate-500">{{ snapshot.needsAttentionProduct.issue.replace("_", " ") }}</p>
      </li>
      <li v-if="snapshot?.growthOpportunity" class="px-4 py-3">
        <p class="text-xs font-medium uppercase tracking-wide text-indigo-600">{{ growthLabel }}</p>
        <p class="mt-1 text-sm font-semibold text-slate-900">{{ snapshot.growthOpportunity.name }}</p>
        <p class="text-xs text-slate-500">{{ snapshot.growthOpportunity.suggestion }}</p>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { useFormatCurrency } from "@/composables/useFormatCurrency";
import { useStoreSnapshot } from "@/composables/dashboard/useStoreSnapshot";
import { useLocalizedString } from "@/composables/useLocalizedString";

const title = useLocalizedString("dashboard", "snapshot.title");
const bestLabel = useLocalizedString("dashboard", "snapshot.bestPerforming");
const attentionLabel = useLocalizedString("dashboard", "snapshot.needsAttention");
const growthLabel = useLocalizedString("dashboard", "snapshot.growthOpportunity");

const { snapshot, loading } = useStoreSnapshot();
const { formatCurrency } = useFormatCurrency();
</script>
