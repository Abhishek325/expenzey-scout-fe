<template>
  <section
    class="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm"
    :class="[paddingClass, fillHeight ? 'h-full min-h-0' : '']"
  >
    <div
      v-if="$slots.header || title || $slots.actions"
      class="mb-3 flex shrink-0 items-center justify-between gap-2"
    >
      <slot name="header">
        <h2 v-if="title" class="text-xs font-bold uppercase tracking-wide text-slate-500">{{ title }}</h2>
      </slot>
      <slot name="actions" />
    </div>
    <div class="report-section-body" :class="bodyClasses">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { REPORT_SECTION_SCROLL_BODY } from "@/constants/dashboardRowHeights";

const props = withDefaults(
  defineProps<{
    title?: string;
    paddingClass?: string;
    fillHeight?: boolean;
    scrollable?: boolean;
    bodyClass?: string;
  }>(),
  {
    paddingClass: "p-4 sm:p-5",
    fillHeight: false,
    scrollable: false,
    bodyClass: "",
  },
);

const bodyClasses = computed(() => {
  if (props.fillHeight && props.scrollable) {
    return ["min-h-0 flex-1 overflow-y-auto", props.bodyClass];
  }
  if (props.fillHeight) {
    return ["min-h-0 flex-1", props.bodyClass];
  }
  if (props.scrollable) {
    return [REPORT_SECTION_SCROLL_BODY, props.bodyClass];
  }
  return [props.bodyClass];
});
</script>
