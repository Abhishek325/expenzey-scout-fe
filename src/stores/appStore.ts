import { defineStore } from "pinia";
import mockConnection from "@/data/settings/mock-connection.json";
import type { DateRangePreset } from "@/types/metrics";

export interface WpConnectionConfig {
  connected: boolean;
  siteUrl: string;
  installationId: string;
  lastSync: string;
}

export const useAppStore = defineStore("app", {
  state: () => ({
    dateRangePreset: "7d" as DateRangePreset,
    connected: mockConnection.connected as boolean,
    siteUrl: mockConnection.siteUrl as string,
    installationId: mockConnection.installationId as string,
    lastSync: mockConnection.lastSync as string,
  }),
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
    },
  },
});
