export interface UsageQuotaItem {
  used: number;
  limit: number;
  labelKey: string;
}

export interface UsageQuota {
  reports: UsageQuotaItem;
  chat: UsageQuotaItem;
}
