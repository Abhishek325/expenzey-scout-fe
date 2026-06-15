import type { WeeklyReportContent } from "@/types/ai";

export interface WeeklyReportWidgetRow {
  key: "revenue" | "orders" | "topProduct" | "customerTrend" | "mainRisk" | "recommendedAction";
  label: string;
  value: string;
  detail?: string;
  trendPercent?: number;
  trendDirection?: "up" | "down";
}

export interface WeeklyReportWidgetLabels {
  revenue: string;
  orders: string;
  topProduct: string;
  customerTrend: string;
  returningCustomers: string;
  mainRisk: string;
  recommendedAction: string;
  ofRevenue: string;
}

function extractPercentFromText(text: string): number | null {
  const match = text.match(/([-+]?\d+(?:\.\d+)?)\s*%/);
  return match ? Number(match[1]) : null;
}

export function buildWeeklyReportWidgetRows(
  content: WeeklyReportContent,
  formatCurrency: (amount: number) => string,
  labels: WeeklyReportWidgetLabels,
): WeeklyReportWidgetRow[] {
  const rows: WeeklyReportWidgetRow[] = [];
  const { periodMetrics, topProducts, customerInsights, needsAttention, recommendedActions } = content;

  rows.push({
    key: "revenue",
    label: labels.revenue,
    value: formatCurrency(periodMetrics.revenue),
    trendPercent: Math.abs(periodMetrics.revenueGrowthPercent),
    trendDirection: periodMetrics.revenueGrowthPercent >= 0 ? "up" : "down",
  });

  rows.push({
    key: "orders",
    label: labels.orders,
    value: String(periodMetrics.orders),
    trendPercent: Math.abs(periodMetrics.ordersGrowthPercent),
    trendDirection: periodMetrics.ordersGrowthPercent >= 0 ? "up" : "down",
  });

  const top = topProducts[0];
  if (top) {
    const share = periodMetrics.revenue > 0
      ? Math.round((top.revenue / periodMetrics.revenue) * 1000) / 10
      : 0;
    rows.push({
      key: "topProduct",
      label: labels.topProduct,
      value: top.productName,
      detail: `${formatCurrency(top.revenue)} (${share}% ${labels.ofRevenue})`,
    });
  }

  rows.push({
    key: "customerTrend",
    label: labels.customerTrend,
    value: labels.returningCustomers,
    trendPercent: Math.abs(customerInsights.returningGrowthPercent),
    trendDirection: customerInsights.returningGrowthPercent >= 0 ? "up" : "down",
  });

  const risk = needsAttention[0];
  if (risk) {
    const parsedPercent = extractPercentFromText(risk);
    const declining = topProducts.find((p) => p.growthPercent < 0);
    const trendPercent = parsedPercent !== null
      ? Math.abs(parsedPercent)
      : declining
        ? Math.abs(declining.growthPercent)
        : undefined;
    const trendDirection = parsedPercent !== null
      ? parsedPercent >= 0 ? "up" : "down"
      : declining
        ? "down"
        : undefined;

    rows.push({
      key: "mainRisk",
      label: labels.mainRisk,
      value: risk,
      trendPercent,
      trendDirection,
    });
  }

  const action = recommendedActions[0];
  if (action) {
    rows.push({
      key: "recommendedAction",
      label: labels.recommendedAction,
      value: action,
    });
  }

  return rows;
}
