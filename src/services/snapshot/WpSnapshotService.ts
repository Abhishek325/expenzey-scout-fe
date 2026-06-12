import type { ISnapshotService } from "@/services/snapshot/ISnapshotService";
import { wpRestFetch } from "@/services/wp/wpRestClient";
import type { StoreSnapshot } from "@/types/snapshot";

export class WpSnapshotService implements ISnapshotService {
  async getStoreSnapshot(): Promise<StoreSnapshot> {
    return wpRestFetch<StoreSnapshot>("/dashboard/snapshot");
  }
}
