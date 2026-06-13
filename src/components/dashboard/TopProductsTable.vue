<script setup lang="ts">
import { computed, ref } from "vue";
import DataTable, { type DataTableColumn } from "@/components/shared/DataTable.vue";
import DashboardCard from "@/components/shared/DashboardCard.vue";
import TrendBadge from "@/components/shared/TrendBadge.vue";
import { INSIGHTS_CARD_BODY_HEIGHT } from "@/constants/dashboardRowHeights";
import { useTopProducts } from "@/composables/dashboard/useTopProducts";
import { useFormatCurrency } from "@/composables/useFormatCurrency";
import { useLocalizedString } from "@/composables/useLocalizedString";

const { products, loading, error, hasData, reload } = useTopProducts();
const { formatCurrency } = useFormatCurrency();
const expanded = ref(false);

const DEFAULT_VISIBLE_ROWS = 5;

const viewAll = useLocalizedString("common", "viewAll");
const emptyLabel = useLocalizedString("common", "noResults");
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
  const rows = expanded.value ? list : list.slice(0, DEFAULT_VISIBLE_ROWS);
  return rows as unknown as Record<string, unknown>[];
});

const viewAllAction = computed(() => ({
  kind: "button" as const,
  label: viewAll.value,
  onClick: () => {
    expanded.value = !expanded.value;
  },
}));

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
  <DashboardCard
    :title="sectionTitle"
    :loading="loading"
    :error="error"
    :has-data="hasData"
    :empty-label="emptyLabel"
    :action="viewAllAction"
    :body-class="`!p-0 ${INSIGHTS_CARD_BODY_HEIGHT}`"
    @retry="reload"
  >
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
  </DashboardCard>
</template>
