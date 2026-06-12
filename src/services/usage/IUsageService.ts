import type { UsageQuota } from "@/types/usage";

export interface IUsageService {
  getUsage(): Promise<UsageQuota>;
}

export const USAGE_SERVICE_KEY = "usageService";
