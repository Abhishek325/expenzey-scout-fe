<script setup lang="ts">
import dayjs from "dayjs";
import { computed, ref } from "vue";
import DataTable, { type DataTableColumn } from "@/components/shared/DataTable.vue";
import { useRecentOrders } from "@/composables/dashboard/useRecentOrders";
import { useFormatCurrency } from "@/composables/useFormatCurrency";
import { useLocalizedString } from "@/composables/useLocalizedString";

const { orders, loading } = useRecentOrders();
const { formatCurrency } = useFormatCurrency();
const expanded = ref(false);

const DEFAULT_VISIBLE_ROWS = 5;

const sectionTitle = useLocalizedString("dashboard", "recentOrdersTitle");
const viewAll = useLocalizedString("common", "viewAll");
const colOrder = useLocalizedString("dashboard", "recentOrdersColumnOrder");
const colCustomer = useLocalizedString("dashboard", "recentOrdersColumnCustomer");
const colTotal = useLocalizedString("dashboard", "recentOrdersColumnTotal");
const colDate = useLocalizedString("dashboard", "recentOrdersColumnDate");
const loadingLabel = useLocalizedString("common", "loading");

const columns = computed<DataTableColumn[]>(() => [
  { key: "orderId", label: colOrder.value },
  { key: "customerName", label: colCustomer.value },
  { key: "total", label: colTotal.value, align: "right" },
  { key: "date", label: colDate.value, align: "right" },
]);

const visibleRows = computed(() => {
  const list = orders.value;
  return expanded.value ? list : list.slice(0, DEFAULT_VISIBLE_ROWS);
});

function formatOrderDate(date: string): string {
  return dayjs(date).format("MMM D");
}
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
    <div class="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
      <h3 class="text-sm font-semibold text-slate-900">{{ sectionTitle }}</h3>
      <button
        type="button"
        class="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100"
        @click="expanded = !expanded"
      >
        {{ viewAll }}
      </button>
    </div>
    <div v-if="loading" class="min-h-[24rem] p-4 text-xs text-slate-500">{{ loadingLabel }}</div>
    <div v-else class="min-h-[24rem]">
      <DataTable
        :columns="columns"
        :rows="visibleRows"
        row-key="orderId"
      >
      <template #cell-orderId="{ row }">
        <span class="font-medium text-indigo-600">{{ row.orderId }}</span>
      </template>
      <template #cell-total="{ row }">
        {{ formatCurrency(Number(row.total)) }}
      </template>
      <template #cell-date="{ row }">
        {{ formatOrderDate(String(row.date)) }}
      </template>
      </DataTable>
    </div>
  </div>
</template>
