import type { IUsageService } from "@/services/usage/IUsageService";
import type { UsageQuota } from "@/types/usage";

export class WpUsageService implements IUsageService {
  async getUsage(): Promise<UsageQuota> {
    throw new Error("Not implemented");
  }
}
