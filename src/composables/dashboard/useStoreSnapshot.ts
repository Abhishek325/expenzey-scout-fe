import { inject, onMounted, ref } from "vue";
import { SNAPSHOT_SERVICE_KEY, type ISnapshotService } from "@/services/snapshot/ISnapshotService";
import type { StoreSnapshot } from "@/types/snapshot";

export function useStoreSnapshot() {
  const snapshotService = inject(SNAPSHOT_SERVICE_KEY) as ISnapshotService;
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

  onMounted(load);

  return { snapshot, loading, error, refresh: load };
}
