import { WpChatService } from "@/services/chat/WpChatService";
import type { IChatService } from "@/services/chat/IChatService";
import { WpMetricsService } from "@/services/metrics/WpMetricsService";
import type { IMetricsService } from "@/services/metrics/IMetricsService";
import { WpProductsService } from "@/services/products/WpProductsService";
import type { IProductsService } from "@/services/products/IProductsService";
import { WpReportsService } from "@/services/reports/WpReportsService";
import type { IReportsService } from "@/services/reports/IReportsService";
import StringService, { type IStringService } from "@/services/stringService";
import { WpUsageService } from "@/services/usage/WpUsageService";
import type { IUsageService } from "@/services/usage/IUsageService";
import { WpSnapshotService } from "@/services/snapshot/WpSnapshotService";
import type { ISnapshotService } from "@/services/snapshot/ISnapshotService";

export interface AppServices {
  stringService: IStringService;
  metricsService: IMetricsService;
  productsService: IProductsService;
  reportsService: IReportsService;
  chatService: IChatService;
  usageService: IUsageService;
  snapshotService: ISnapshotService;
}

export function createServices(): AppServices {
  return {
    stringService: new StringService(),
    metricsService: new WpMetricsService(),
    productsService: new WpProductsService(),
    reportsService: new WpReportsService(),
    chatService: new WpChatService(),
    usageService: new WpUsageService(),
    snapshotService: new WpSnapshotService(),
  };
}
