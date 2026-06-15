<template>
  <article class="rounded-xl border p-4" :class="variantClass[variant]">
    <div class="flex gap-3">
      <FaIcon v-if="iconName" :icon="iconName" size="lg" icon-class="shrink-0 text-slate-600" />
      <div class="min-w-0 flex-1">
        <p v-if="resolvedTitle" class="text-xs font-medium uppercase tracking-wide text-slate-500">
          {{ resolvedTitle }}
        </p>
        <p v-if="productName" class="mt-1 text-sm font-bold text-slate-900">{{ productName }}</p>
        <p v-if="resolvedDetail" class="mt-1 text-sm leading-relaxed text-slate-600">{{ resolvedDetail }}</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import FaIcon from "@/components/icons/FaIcon.vue";
import { resolveStringKey } from "@/composables/dashboard/resolveStringKey";
import { STRING_SERVICE_KEY, type IStringService } from "@/services/stringService";

type InsightVariant = "success" | "danger" | "info";
type InsightIcon = "trophy" | "warning" | "lightbulb";

const props = defineProps<{
  variant: InsightVariant;
  title?: string;
  detail?: string;
  labelKey?: string;
  detailKey?: string;
  textKey?: string;
  productName?: string;
  icon?: InsightIcon;
}>();

const stringService = inject(STRING_SERVICE_KEY) as IStringService;

const resolvedTitle = computed(() => {
  if (props.title) {
    return props.title;
  }
  if (props.labelKey) {
    return resolveStringKey(stringService, props.labelKey);
  }
  return "";
});

const resolvedDetail = computed(() => {
  if (props.detail) {
    return props.detail;
  }
  const key = props.textKey ?? props.detailKey;
  if (key) {
    return resolveStringKey(stringService, key);
  }
  return "";
});

const iconName = computed(() => {
  const map: Record<InsightIcon, string> = {
    trophy: "fa-trophy",
    warning: "fa-triangle-exclamation",
    lightbulb: "fa-lightbulb",
  };
  return props.icon ? map[props.icon] : "";
});

const variantClass: Record<InsightVariant, string> = {
  success: "border-emerald-200 bg-emerald-50",
  danger: "border-rose-200 bg-rose-50",
  info: "border-sky-200 bg-sky-50",
};
</script>
