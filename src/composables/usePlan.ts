import { computed, inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { ROUTES } from "@/constants/routes";
import { USAGE_SERVICE_KEY, type IUsageService } from "@/services/usage/IUsageService";
import type { PlanTier, UsageQuota } from "@/types/usage";

const usageState = ref<UsageQuota | null>(null);
const usageLoading = ref(false);

export async function refreshPlan(): Promise<void> {
  usageLoading.value = true;
  try {
    const usageService = (await import("@/services/createServices")).createServices().usageService;
    usageState.value = await usageService.getUsage();
  } finally {
    usageLoading.value = false;
  }
}

export function usePlan() {
  const router = useRouter();
  const usageService = inject(USAGE_SERVICE_KEY) as IUsageService | undefined;

  const plan = computed<PlanTier>(() => usageState.value?.plan ?? "free");
  const isPro = computed(() => plan.value === "pro");
  const usage = computed(() => usageState.value);

  async function refresh(): Promise<void> {
    if (usageService) {
      usageLoading.value = true;
      try {
        usageState.value = await usageService.getUsage();
      } finally {
        usageLoading.value = false;
      }
      return;
    }
    await refreshPlan();
  }

  function goToUpgrade(_feature?: string) {
    void router.push(ROUTES.PRO);
  }

  onMounted(() => {
    if (!usageState.value) {
      void refresh();
    }
  });

  return {
    plan,
    isPro,
    usage,
    usageLoading,
    refreshPlan: refresh,
    goToUpgrade,
  };
}
