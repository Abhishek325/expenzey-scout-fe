import { computed, onMounted, ref, watch, type Ref } from "vue";
import { useDateRangeStore } from "@/stores/dateRange";
import type { DashboardWidgetState } from "@/types/dashboardWidget";

interface UseDashboardWidgetOptions<T> {
  hasData: (data: T | null) => boolean;
  watchDateRange?: boolean;
  watchOnMount?: boolean;
}

export function useDashboardWidget<T>(
  fetch: () => Promise<T>,
  options: UseDashboardWidgetOptions<T>
): { data: Ref<T | null> } & DashboardWidgetState {
  const dateRange = useDateRangeStore();
  const loading = ref(true);
  const error = ref<string | null>(null);
  const data = ref<T | null>(null) as Ref<T | null>;

  async function reload() {
    loading.value = true;
    error.value = null;
    try {
      data.value = await fetch();
    } catch (e) {
      error.value = e instanceof Error ? e.message : "error";
    } finally {
      loading.value = false;
    }
  }

  const hasData = computed(() => options.hasData(data.value));

  if (options.watchOnMount) {
    onMounted(() => {
      void reload();
    });
  }

  if (options.watchDateRange !== false && !options.watchOnMount) {
    watch(() => dateRange.rangeKey, reload, { immediate: true });
  }

  return { data, loading, error, hasData, reload };
}
