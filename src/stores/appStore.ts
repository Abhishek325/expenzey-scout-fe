import { defineStore } from "pinia";
import mockConnection from "@/data/settings/mock-connection.json";
import type { DataSource } from "@/services/createServices";
import { isWpContext, wpRestFetch } from "@/services/wp/wpRestClient";
import type { DateRangePreset } from "@/types/metrics";

export interface WpConnectionConfig {
  connected: boolean;
  siteUrl: string;
  installationId: string;
  lastSync: string;
  dataSource?: DataSource;
}

export const useAppStore = defineStore("app", {
  state: () => ({
    dateRangePreset: "7d" as DateRangePreset,
    connected: mockConnection.connected as boolean,
    siteUrl: mockConnection.siteUrl as string,
    installationId: mockConnection.installationId as string,
    lastSync: mockConnection.lastSync as string,
    dataSource: "mock" as DataSource,
  }),
  getters: {
    requiresOnboarding(state): boolean {
      return state.dataSource === "api" && !state.connected;
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
      if (config.dataSource) {
        this.dataSource = config.dataSource;
      }
    },
    async completeConnection(): Promise<void> {
      if (isWpContext()) {
        const result = await wpRestFetch<{ connected: boolean; lastSync: string }>(
          "/connection/connect",
          { method: "POST" }
        );
        this.applyWpConfig({
          connected: true,
          siteUrl: this.siteUrl,
          installationId: this.installationId,
          lastSync: result.lastSync,
        });
        return;
      }

      this.setConnected(true);
    },
  },
});
