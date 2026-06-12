import type { DataSource } from "@/services/createServices";

export interface ExpenzeyAiConfig {
  restUrl: string;
  nonce: string;
  connected: boolean;
  siteUrl: string;
  installationId: string;
  lastSync: string;
  locale: string;
  dataSource: DataSource;
  pluginVersion: string;
  isAdmin: boolean;
}

declare global {
  interface Window {
    expenzeyAi?: ExpenzeyAiConfig;
  }
}

export {};
