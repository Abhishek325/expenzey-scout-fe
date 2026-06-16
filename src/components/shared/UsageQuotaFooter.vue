<template>
  <div class="text-xs text-slate-500">
    <span>{{ meterText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue";
import { useReactiveLocaleStringRecord } from "@/composables/useLocalizedString";
import { formatLocaleTemplate } from "@/utils/formatLocaleTemplate";
import { USAGE_SERVICE_KEY, type IUsageService } from "@/services/usage/IUsageService";
import type { UsageQuota } from "@/types/usage";

const props = defineProps<{
  used?: number;
  limit?: number;
  feature?: "chat" | "reports";
}>();

const usageService = inject(USAGE_SERVICE_KEY) as IUsageService;
const quota = ref<UsageQuota | null>(null);

onMounted(async () => {
  if (props.used === undefined && props.feature) {
    quota.value = await usageService.getUsage();
  }
});

const copy = useReactiveLocaleStringRecord("usage", ["remaining", "usedOfLimit"] as const);

const resolvedUsed = computed(() => {
  if (props.used !== undefined) return props.used;
  if (!props.feature || !quota.value) return 0;
  return quota.value.chat.used;
});

const resolvedLimit = computed(() => {
  if (props.limit !== undefined) return props.limit;
  if (!props.feature || !quota.value) return 0;
  return quota.value.chat.limit;
});

const remainingCount = computed(() =>
  Math.max(resolvedLimit.value - resolvedUsed.value, 0),
);

const meterText = computed(() => {
  if (props.feature === "chat") {
    return formatLocaleTemplate(copy.value.usedOfLimit, {
      used: resolvedUsed.value,
      limit: resolvedLimit.value,
    });
  }
  return formatLocaleTemplate(copy.value.remaining, {
    remaining: remainingCount.value,
    limit: resolvedLimit.value,
  });
});
</script>
