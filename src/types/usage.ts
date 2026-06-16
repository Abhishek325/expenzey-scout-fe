export type PlanTier = "free" | "pro";

export interface UsageQuotaItem {
  used: number;
  limit: number;
  remaining?: number;
  labelKey: string;
}

export interface UsageQuota {
  plan: PlanTier;
  chat: UsageQuotaItem;
  reports: {
    stored: number;
    historyLimit: number;
    labelKey: string;
  };
  opportunities: {
    visible: number;
    labelKey: string;
  };
}

export interface PlanActivationResult {
  plan: PlanTier;
  alreadyActive?: boolean;
}
