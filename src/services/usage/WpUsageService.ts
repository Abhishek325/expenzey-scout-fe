import type { IUsageService } from "@/services/usage/IUsageService";
import { wpRestFetch } from "@/services/wp/wpRestClient";
import type { UsageQuota } from "@/types/usage";

export class WpUsageService implements IUsageService {
  async getUsage(): Promise<UsageQuota> {
    return wpRestFetch<UsageQuota>("/usage");
  }
}
