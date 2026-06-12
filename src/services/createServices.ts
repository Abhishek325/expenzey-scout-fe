import { MockChatService } from "@/services/chat/MockChatService";
import { WpChatService } from "@/services/chat/WpChatService";
import type { IChatService } from "@/services/chat/IChatService";
import { MockMetricsService } from "@/services/metrics/MockMetricsService";
import { WpMetricsService } from "@/services/metrics/WpMetricsService";
import type { IMetricsService } from "@/services/metrics/IMetricsService";
import { MockOrdersService } from "@/services/orders/MockOrdersService";
import { WpOrdersService } from "@/services/orders/WpOrdersService";
import type { IOrdersService } from "@/services/orders/IOrdersService";
import { MockProductsService } from "@/services/products/MockProductsService";
import { WpProductsService } from "@/services/products/WpProductsService";
import type { IProductsService } from "@/services/products/IProductsService";
import { MockReportsService } from "@/services/reports/MockReportsService";
import { WpReportsService } from "@/services/reports/WpReportsService";
import type { IReportsService } from "@/services/reports/IReportsService";
import StringService, { type IStringService } from "@/services/stringService";
import { MockUsageService } from "@/services/usage/MockUsageService";
import { WpUsageService } from "@/services/usage/WpUsageService";
import type { IUsageService } from "@/services/usage/IUsageService";

export type DataSource = "mock" | "api";

export interface AppServices {
  stringService: IStringService;
  metricsService: IMetricsService;
  ordersService: IOrdersService;
  productsService: IProductsService;
  reportsService: IReportsService;
  chatService: IChatService;
  usageService: IUsageService;
}

function resolveDataSource(): DataSource {
  const wpSource = window.expenzeyAi?.dataSource;
  if (wpSource === "api" || wpSource === "mock") {
    return wpSource;
  }

  const source = import.meta.env.VITE_DATA_SOURCE ?? "mock";
  return source === "api" ? "api" : "mock";
}

export function createServices(): AppServices {
  const dataSource = resolveDataSource();
  const useMock = dataSource === "mock";

  return {
    stringService: new StringService(),
    metricsService: useMock ? new MockMetricsService() : new WpMetricsService(),
    ordersService: useMock ? new MockOrdersService() : new WpOrdersService(),
    productsService: useMock ? new MockProductsService() : new WpProductsService(),
    reportsService: useMock ? new MockReportsService() : new WpReportsService(),
    chatService: useMock ? new MockChatService() : new WpChatService(),
    usageService: useMock ? new MockUsageService() : new WpUsageService(),
  };
}
