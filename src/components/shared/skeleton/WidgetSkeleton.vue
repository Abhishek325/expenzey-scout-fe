<template>
  <SkeletonShimmer class="h-full w-full">
    <div v-if="variant === 'chart'" class="h-full w-full">
      <ChartSkeleton class="h-full w-full" />
    </div>

    <div v-else-if="variant === 'table'" class="h-full w-full">
      <SkeletonTable :columns="columns ?? []" :row-count="rowCount" />
    </div>

    <div v-else-if="variant === 'list'" class="flex flex-col gap-3">
      <div
        v-for="n in rowCount"
        :key="n"
        class="rounded-xl border border-slate-100 bg-slate-50/40 p-4"
      >
        <div class="flex items-start gap-3">
          <SkeletonBlock class-name="h-10 w-10 rounded-lg" />
          <div class="flex-1">
            <SkeletonText :lines="2" width-preset="long" />
            <div class="mt-3 flex items-center gap-2">
              <SkeletonBlock class-name="h-5 w-16" pill />
              <SkeletonBlock class-name="h-5 w-20" pill />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-3">
      <SkeletonBlock class-name="h-3 w-1/3" pill />
      <SkeletonText :lines="3" width-preset="long" />
      <div class="grid grid-cols-3 gap-2 pt-2">
        <SkeletonBlock class-name="h-8 w-full rounded-lg" />
        <SkeletonBlock class-name="h-8 w-full rounded-lg" />
        <SkeletonBlock class-name="h-8 w-full rounded-lg" />
      </div>
    </div>
  </SkeletonShimmer>
</template>

<script setup lang="ts">
import ChartSkeleton from "@/components/dashboard/ChartSkeleton.vue";
import type { DataTableColumn } from "@/components/shared/DataTable.vue";
import SkeletonBlock from "@/components/shared/skeleton/SkeletonBlock.vue";
import SkeletonShimmer from "@/components/shared/skeleton/SkeletonShimmer.vue";
import SkeletonTable from "@/components/shared/skeleton/SkeletonTable.vue";
import SkeletonText from "@/components/shared/skeleton/SkeletonText.vue";

export type WidgetSkeletonVariant = "card" | "list" | "table" | "chart" | "none";

withDefaults(
  defineProps<{
    variant?: Exclude<WidgetSkeletonVariant, "none">;
    rowCount?: number;
    columns?: DataTableColumn[];
  }>(),
  { variant: "card", rowCount: 5, columns: undefined }
);
</script>

