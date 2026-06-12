import mockUsage from "@/data/settings/mock-usage.json";
import { simulateDelay } from "@/services/delay";
import type { IUsageService } from "@/services/usage/IUsageService";
import type { UsageQuota } from "@/types/usage";

export class MockUsageService implements IUsageService {
  async getUsage(): Promise<UsageQuota> {
    await simulateDelay();
    return mockUsage as UsageQuota;
  }
}
