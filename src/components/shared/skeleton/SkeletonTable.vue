<template>
  <div class="overflow-x-auto">
    <table class="min-w-full table-fixed text-left text-xs">
      <thead>
        <tr class="border-b border-slate-100 text-xs font-medium text-slate-500">
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-3 py-2 first:pl-4 last:pr-4"
            :class="[col.className, col.align === 'right' ? 'text-right' : 'text-left']"
          >
            <SkeletonBlock class-name="h-3 w-20" pill />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="r in rowCount"
          :key="r"
          class="border-b border-slate-100 last:border-0"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-3 py-2.5 first:pl-4 last:pr-4"
            :class="[col.className, col.align === 'right' ? 'text-right' : 'text-left']"
          >
            <SkeletonBlock :class-name="cellWidthClass(r, col.key)" class="h-3" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import SkeletonBlock from "@/components/shared/skeleton/SkeletonBlock.vue";
import type { DataTableColumn } from "@/components/shared/DataTable.vue";

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn[];
    rowCount?: number;
  }>(),
  { rowCount: 5 }
);

function cellWidthClass(rowIndex: number, colKey: string): string {
  const seed = `${rowIndex}-${colKey}`.length;
  const widths = ["w-2/3", "w-1/2", "w-3/5", "w-4/5", "w-2/5"];
  return `h-3 ${widths[seed % widths.length]}`;
}
</script>

