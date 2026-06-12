import type { StoreSnapshot } from "@/types/snapshot";

export interface ISnapshotService {
  getStoreSnapshot(): Promise<StoreSnapshot>;
}

export const SNAPSHOT_SERVICE_KEY = "snapshotService";
