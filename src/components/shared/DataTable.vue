<template>
  <div class="overflow-x-auto">
    <table
      class="w-full text-left text-xs"
      :class="fixed ? 'table-fixed' : 'min-w-full'"
    >
      <thead>
        <tr class="border-b border-slate-100 text-xs font-medium text-slate-500">
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-3 py-2 first:pl-4 last:pr-4"
            :class="[
              col.className,
              col.align === 'right' ? 'text-right' : 'text-left',
            ]"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in rows"
          :key="String(row[props.rowKey] ?? index)"
          class="border-b border-slate-100 last:border-0 hover:bg-slate-50/80"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-3 py-2.5 text-slate-600 first:pl-4 last:pr-4"
            :class="[
              col.className,
              fixed && col.className ? 'max-w-0' : '',
              col.align === 'right' ? 'text-right' : 'text-left',
            ]"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
export interface DataTableColumn {
  key: string;
  label: string;
  align?: "left" | "right";
  className?: string;
}

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn[];
    rows: Record<string, unknown>[];
    rowKey?: string;
    fixed?: boolean;
  }>(),
  { rowKey: "id", fixed: false }
);
</script>
