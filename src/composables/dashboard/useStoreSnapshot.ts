import { computed, inject, ref, watch } from "vue";
import { SNAPSHOT_SERVICE_KEY, type ISnapshotService } from "@/services/snapshot/ISnapshotService";
import { useDashboardOverviewStore } from "@/stores/dashboardOverviewStore";
import { useDateRangeStore } from "@/stores/dateRange";
import type { StoreSnapshot } from "@/types/snapshot";

export function useStoreSnapshot() {
  const snapshotService = inject(SNAPSHOT_SERVICE_KEY) as ISnapshotService;
  const overviewStore = useDashboardOverviewStore();
  const dateRange = useDateRangeStore();
  const snapshot = ref<StoreSnapshot | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      snapshot.value = await snapshotService.getStoreSnapshot();
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load snapshot";
    } finally {
      loading.value = false;
    }
  }

  const inOverviewRange = computed(() => overviewStore.loadedRangeKey === dateRange.rangeKey);

  watch(
    [() => dateRange.rangeKey, () => overviewStore.snapshot, () => overviewStore.loading, () => overviewStore.error],
    async () => {
      if (inOverviewRange.value && overviewStore.snapshot) {
        snapshot.value = overviewStore.snapshot;
        loading.value = overviewStore.loading;
        error.value = overviewStore.error;
        return;
      }

      const waitingForOverview =
        overviewStore.loading &&
        overviewStore.requestedRangeKey === dateRange.rangeKey;
      if (waitingForOverview) {
        loading.value = true;
        error.value = null;
        return;
      }

      await load();
    },
    { immediate: true },
  );

  return { snapshot, loading, error, refresh: load };
}
