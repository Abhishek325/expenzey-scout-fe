<template>
  <ReportSectionCard fill-height>
    <template #header>
      <h2 class="text-xs font-bold uppercase tracking-wide text-slate-500">{{ title }}</h2>
    </template>

    <div v-if="products.length" class="-mx-1">
      <table class="w-full min-w-full text-left text-xs">
        <thead class="sticky top-0 z-10 bg-white">
          <tr class="border-b border-slate-100 text-xs font-medium text-slate-500">
            <th class="px-1 pb-2 font-medium">{{ productLabel }}</th>
            <th class="px-1 pb-2 text-right font-medium">{{ revenueLabel }}</th>
            <th class="px-1 pb-2 text-right font-medium">{{ growthLabel }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in products"
            :key="product.productName"
            class="border-b border-slate-100 last:border-0"
          >
            <td class="py-2.5 pr-2">
              <div class="flex items-center gap-2.5">
                <img
                  v-if="product.imageUrl"
                  :src="product.imageUrl"
                  :alt="product.productName"
                  class="h-8 w-8 shrink-0 rounded-md border border-slate-100 object-cover"
                />
                <span
                  v-else
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-100 bg-slate-100 text-slate-400"
                  aria-hidden="true"
                >
                  <FaIcon icon="fa-shirt" size="xs" />
                </span>
                <span class="font-medium text-slate-900">{{ product.productName }}</span>
              </div>
            </td>
            <td class="px-1 py-2.5 text-right font-medium text-slate-900">
              {{ formatCurrency(product.revenue) }}
            </td>
            <td class="px-1 py-2.5 text-right">
              <TrendBadge
                compact
                :percent="product.growthPercent"
                :direction="product.growthPercent >= 0 ? 'up' : 'down'"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-400">
      {{ emptyLabel }}
    </p>
  </ReportSectionCard>
</template>

<script setup lang="ts">
import FaIcon from "@/components/icons/FaIcon.vue";
import ReportSectionCard from "@/components/reports/ReportSectionCard.vue";
import TrendBadge from "@/components/shared/TrendBadge.vue";
import { useFormatCurrency } from "@/composables/useFormatCurrency";
import { useLocalizedString } from "@/composables/useLocalizedString";
import type { WeeklyReportTopProduct } from "@/types/ai";

defineProps<{ title: string; products: WeeklyReportTopProduct[] }>();

const { formatCurrency } = useFormatCurrency();
const productLabel = useLocalizedString("reports", "table.product");
const revenueLabel = useLocalizedString("reports", "table.revenue");
const growthLabel = useLocalizedString("reports", "table.growth");
const emptyLabel = useLocalizedString("reports", "detail.noData");
</script>
