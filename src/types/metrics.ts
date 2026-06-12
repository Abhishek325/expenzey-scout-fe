export type DateRangePreset = "7d" | "30d" | "90d" | "12mo";

export type RevenueChartGranularity = "daily" | "weekly" | "monthly";

export type MetricChangeDirection = "up" | "down" | "flat";

export interface DateRangeSelection {
  start: Date;
  end: Date;
  preset: DateRangePreset | null;
}

export interface MetricCard {
  id: string;
  labelKey: string;
  value: number;
  formattedValue: string;
  changePercent: number;
  changeDirection: MetricChangeDirection;
}

export interface RevenueTrendPoint {
  date: string;
  revenue: number;
}

export interface DashboardMetrics {
  comparisonPeriod: string;
  kpis: MetricCard[];
}

export interface RevenueTrend {
  currency: string;
  period: string;
  granularity: RevenueChartGranularity;
  dataPoints: RevenueTrendPoint[];
}
