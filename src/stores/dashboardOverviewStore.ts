import { defineStore } from "pinia";
import { wpRestFetch } from "@/services/wp/wpRestClient";
import { withDateRange } from "@/services/wp/wpQueryUtils";
import type { DashboardMetrics, RevenueTrend, RevenueChartGranularity } from "@/types/metrics";
import type { ProductRow } from "@/types/products";
import type { StoreSnapshot } from "@/types/snapshot";
import type { DateRangeSelection } from "@/types/metrics";

const OVERVIEW_TTL_MS = 60_000;

export interface DashboardOverviewResponse {
  metrics: DashboardMetrics;
  revenue: RevenueTrend;
  snapshot: StoreSnapshot;
  topProducts: ProductRow[];
}

export const useDashboardOverviewStore = defineStore("dashboardOverview", {
  state: () => ({
    loading: false as boolean,
    error: null as string | null,
    requestedRangeKey: null as string | null,
    requestedGranularity: "daily" as RevenueChartGranularity,
    loadedAt: 0 as number,
    loadedRangeKey: null as string | null,
    loadedGranularity: "daily" as RevenueChartGranularity,
    metrics: null as DashboardMetrics | null,
    revenue: null as RevenueTrend | null,
    snapshot: null as StoreSnapshot | null,
    topProducts: [] as ProductRow[],
  }),
  actions: {
    reset() {
      this.loading = false;
      this.error = null;
      this.requestedRangeKey = null;
      this.requestedGranularity = "daily";
      this.loadedAt = 0;
      this.loadedRangeKey = null;
      this.loadedGranularity = "daily";
      this.metrics = null;
      this.revenue = null;
      this.snapshot = null;
      this.topProducts = [];
    },
    async fetch(
      selection: DateRangeSelection,
      rangeKey: string,
      granularity: RevenueChartGranularity = "daily",
      force = false
    ) {
      const now = Date.now();
      const freshEnough =
        this.loadedRangeKey === rangeKey &&
        this.loadedGranularity === granularity &&
        now - this.loadedAt < OVERVIEW_TTL_MS;

      if (!force && freshEnough && this.metrics && this.revenue && this.snapshot) {
        return;
      }

      this.loading = true;
      this.error = null;
      this.requestedRangeKey = rangeKey;
      this.requestedGranularity = granularity;
      try {
        const path = `${withDateRange("/dashboard/overview", selection)}&granularity=${granularity}&limit=20`;
        const data = await wpRestFetch<DashboardOverviewResponse>(path);
        this.metrics = data.metrics;
        this.revenue = data.revenue;
        this.snapshot = data.snapshot;
        this.topProducts = Array.isArray(data.topProducts) ? data.topProducts : [];
        this.loadedRangeKey = rangeKey;
        this.loadedGranularity = granularity;
        this.loadedAt = Date.now();
      } catch (e) {
        this.error = e instanceof Error ? e.message : "error";
        this.metrics = null;
        this.revenue = null;
        this.snapshot = null;
        this.topProducts = [];
        this.loadedRangeKey = null;
        this.loadedAt = 0;
      } finally {
        this.loading = false;
        this.requestedRangeKey = null;
      }
    },
  },
});

