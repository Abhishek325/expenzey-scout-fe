<script setup lang="ts">
import { computed, ref } from "vue";
import DataTable, { type DataTableColumn } from "@/components/shared/DataTable.vue";
import TrendBadge from "@/components/shared/TrendBadge.vue";
import { useTopProducts } from "@/composables/dashboard/useTopProducts";
import { useFormatCurrency } from "@/composables/useFormatCurrency";
import { useLocalizedString } from "@/composables/useLocalizedString";

const { products, loading } = useTopProducts();
const { formatCurrency } = useFormatCurrency();
const expanded = ref(false);

const DEFAULT_VISIBLE_ROWS = 5;

const viewAll = useLocalizedString("common", "viewAll");
const loadingLabel = useLocalizedString("common", "loading");
const sectionTitle = useLocalizedString("dashboard", "topProductsTitle");
const colProductLabel = useLocalizedString("dashboard", "topProductsColumnProduct");
const colRevenueLabel = useLocalizedString("dashboard", "topProductsColumnRevenue");
const colOrdersLabel = useLocalizedString("dashboard", "topProductsColumnOrders");
const colGrowthLabel = useLocalizedString("dashboard", "topProductsColumnGrowth");

const columns = computed<DataTableColumn[]>(() => [
  { key: "product", label: colProductLabel.value },
  { key: "revenue", label: colRevenueLabel.value, align: "right" },
  { key: "orders", label: colOrdersLabel.value, align: "right" },
  { key: "growth", label: colGrowthLabel.value, align: "right" },
]);

const visibleRows = computed(() => {
  const list = products.value;
  return expanded.value ? list : list.slice(0, DEFAULT_VISIBLE_ROWS);
});

function productImageUrl(row: Record<string, unknown>): string | null {
  const url = row.imageUrl ?? row.image_url;
  if (typeof url !== "string" || url.trim() === "") {
    return null;
  }
  return url;
}

function productInitial(row: Record<string, unknown>): string {
  const name = String(row.name ?? "?").trim();
  return name.charAt(0).toUpperCase() || "?";
}
</script>

<template>
  <div class="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div class="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-2.5">
      <h3 class="text-sm font-semibold text-slate-900">{{ sectionTitle }}</h3>
      <button
        type="button"
        class="card-header-action"
        @click="expanded = !expanded"
      >
        {{ viewAll }}
      </button>
    </div>
    <div v-if="loading" class="min-h-0 flex-1 overflow-y-auto p-4 text-xs text-slate-500">
      {{ loadingLabel }}
    </div>
    <div v-else class="min-h-0 flex-1 overflow-y-auto">
      <DataTable :columns="columns" :rows="visibleRows" row-key="id">
        <template #cell-product="{ row }">
          <div class="flex items-center gap-2.5">
            <img
              v-if="productImageUrl(row)"
              :src="productImageUrl(row)!"
              :alt="String(row.name)"
              class="h-8 w-8 shrink-0 rounded-md border border-slate-100 object-cover"
            />
            <div
              v-else
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-100 bg-slate-100 text-xs font-semibold text-slate-500"
              aria-hidden="true"
            >
              {{ productInitial(row) }}
            </div>
            <span class="text-slate-800">{{ row.name }}</span>
          </div>
        </template>
        <template #cell-revenue="{ row }">
          {{ formatCurrency(Number(row.revenue)) }}
        </template>
        <template #cell-growth="{ row }">
          <TrendBadge
            compact
            :percent="Number(row.growthPercent)"
            :direction="Number(row.growthPercent) >= 0 ? 'up' : 'down'"
          />
        </template>
      </DataTable>
    </div>
  </div>
</template>
