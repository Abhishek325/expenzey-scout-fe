<template>
  <p class="text-xs text-slate-500" :class="limitReached ? 'font-medium text-amber-700' : ''">
    {{ meterText }}
  </p>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import { formatLocaleTemplate } from "@/utils/formatLocaleTemplate";

const props = defineProps<{
  used: number;
  limit: number;
  feature?: "chat" | "reports";
}>();

const copy = useReactiveLocaleStringRecord("usage", [
  "usedOfLimit",
  "remaining",
  "limitReached",
] as const);

const limitReached = computed(() => props.limit > 0 && props.used >= props.limit);

const meterText = computed(() => {
  if (limitReached.value) {
    return copy.value.limitReached;
  }
  if (props.feature === "chat") {
    return formatLocaleTemplate(copy.value.usedOfLimit, {
      used: props.used,
      limit: props.limit,
    });
  }
  return formatLocaleTemplate(copy.value.remaining, {
    remaining: Math.max(props.limit - props.used, 0),
    limit: props.limit,
  });
});
</script>
