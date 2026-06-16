import { defineStore } from "pinia";
import { isWpContext, wpRestFetch } from "@/services/wp/wpRestClient";
import type { DateRangePreset } from "@/types/metrics";

export type SyncStatus = "idle" | "queued" | "syncing" | "completed" | "error";
export type AccountStatus = "active" | "trial" | "suspended" | "disconnected";

export interface WpConnectionConfig {
  connected: boolean;
  siteUrl: string;
  installationId: string;
  lastSync: string;
  currency?: string;
  locale?: string;
  accountStatus?: AccountStatus;
  syncStatus?: SyncStatus;
}

export interface SyncStatusResponse {
  status: SyncStatus;
  lastSync: string | null;
  entityCounts: Record<string, number>;
  error: string | null;
}

export const useAppStore = defineStore("app", {
  state: () => ({
    dateRangePreset: "7d" as DateRangePreset,
    connected: false,
    siteUrl: "",
    installationId: "",
    lastSync: "",
    currency: "",
    locale: "en-us",
    accountStatus: "active" as AccountStatus,
    syncStatus: "idle" as SyncStatus,
  }),
  getters: {
    requiresOnboarding(state): boolean {
      return isWpContext() && !state.connected;
    },
  },
  actions: {
    setDateRangePreset(preset: DateRangePreset) {
      this.dateRangePreset = preset;
    },
    setConnected(connected: boolean) {
      this.connected = connected;
    },
    applyWpConfig(config: WpConnectionConfig) {
      this.connected = config.connected;
      this.siteUrl = config.siteUrl;
      this.installationId = config.installationId;
      this.lastSync = config.lastSync;
      if (config.accountStatus) {
        this.accountStatus = config.accountStatus;
      }
      if (config.syncStatus) {
        this.syncStatus = config.syncStatus;
      }
      if (config.currency !== undefined) {
        this.currency = config.currency;
      }
      if (config.locale) {
        this.locale = config.locale;
      }
    },
    async completeConnection(): Promise<void> {
      if (isWpContext()) {
        const result = await wpRestFetch<{
          connected: boolean;
          lastSync: string;
          accountStatus?: AccountStatus;
          syncStatus?: SyncStatus;
        }>("/connection/connect", { method: "POST" });
        this.applyWpConfig({
          connected: true,
          siteUrl: this.siteUrl,
          installationId: this.installationId,
          lastSync: result.lastSync,
          accountStatus: result.accountStatus,
          syncStatus: result.syncStatus,
        });
        return;
      }

      this.setConnected(true);
    },
    async disconnect(): Promise<void> {
      if (isWpContext()) {
        await wpRestFetch("/connection/disconnect", { method: "POST" });
      }
      this.applyWpConfig({
        connected: false,
        siteUrl: this.siteUrl,
        installationId: this.installationId,
        lastSync: this.lastSync,
        accountStatus: "disconnected",
        syncStatus: "idle",
      });
    },
    async fetchSyncStatus(): Promise<SyncStatusResponse | null> {
      if (!isWpContext()) {
        return null;
      }
      try {
        return await wpRestFetch<SyncStatusResponse>("/sync/status", { cacheTtlMs: 0 });
      } catch {
        return null;
      }
    },
  },
});
