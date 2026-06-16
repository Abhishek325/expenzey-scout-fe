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
  licensing?: {
    enabled: boolean;
    upgradeUrl: string | null;
    pricingPageUrl: string | null;
    accountUrl: string | null;
    contactUrl: string | null;
    isPro?: boolean;
    paidPlanId?: string | null;
    paidPricingId?: string | null;
    pricingConfig?: Record<string, unknown> | null;
  };
}

declare global {
  interface Window {
    expenzeyAi?: ExpenzeyAiConfig;
    Freemius?: {
      pricing?: {
        new: (config: Record<string, unknown>) => void;
      };
    };
  }
}

export {};
