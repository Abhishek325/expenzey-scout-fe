export interface ExpenzeyAiConfig {
  restUrl: string;
  nonce: string;
  connected: boolean;
  siteUrl: string;
  installationId: string;
  lastSync: string;
  accountStatus?: string;
  syncStatus?: string;
  locale: string;
  currency: string;
  pluginVersion: string;
  isAdmin: boolean;
}

declare global {
  interface Window {
    expenzeyAi?: ExpenzeyAiConfig;
  }
}

export {};
