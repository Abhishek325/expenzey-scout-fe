import type {
  GenerateWeeklyReportResult,
  ReportKeyHighlight,
  WeeklyReportListItem,
} from "@/types/reports";

export interface PriorWeekRange {
  periodStart: string;
  periodEnd: string;
  comparisonPeriodStart: string;
  comparisonPeriodEnd: string;
}

export interface RelativeDateLabels {
  today: string;
  yesterday: string;
  daysAgo: string;
  tomorrow: string;
  inDays: string;
}

/** Prior calendar week Mon–Sun (matches backend scheduler). */
export function getPriorWeekRange(now = new Date()): PriorWeekRange {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  const thisMonday = new Date(d);
  thisMonday.setDate(d.getDate() - daysSinceMonday);
  const priorMonday = new Date(thisMonday);
  priorMonday.setDate(thisMonday.getDate() - 7);
  const priorSunday = new Date(thisMonday);
  priorSunday.setDate(thisMonday.getDate() - 1);
  const comparisonMonday = new Date(priorMonday);
  comparisonMonday.setDate(priorMonday.getDate() - 7);
  const comparisonSunday = new Date(priorMonday);
  comparisonSunday.setDate(priorMonday.getDate() - 1);

  const fmt = (date: Date) => date.toISOString().slice(0, 10);
  return {
    periodStart: fmt(priorMonday),
    periodEnd: fmt(priorSunday),
    comparisonPeriodStart: fmt(comparisonMonday),
    comparisonPeriodEnd: fmt(comparisonSunday),
  };
}

export function formatReportPeriod(start: string, end: string): string {
  const fmt = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const year = new Date(`${end}T00:00:00`).getFullYear();
  return `${fmt(start)} – ${fmt(end)}, ${year}`;
}

export function formatReportPeriodShort(start: string, end: string): string {
  const fmt = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function formatGeneratedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatRelativeDate(
  iso: string,
  labels: Pick<RelativeDateLabels, "today" | "yesterday" | "daysAgo">,
): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days <= 0) return labels.today;
  if (days === 1) return labels.yesterday;
  return labels.daysAgo.replace("{days}", String(days));
}

export function formatUpcomingDate(
  iso: string,
  labels: Pick<RelativeDateLabels, "today" | "tomorrow" | "inDays">,
): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  const days = Math.ceil(diffMs / 86400000);
  if (days <= 0) return labels.today;
  if (days === 1) return labels.tomorrow;
  return labels.inDays.replace("{days}", String(days));
}

export function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]?/);
  return match ? match[0].trim() : text.slice(0, 80);
}

/** Split executive summary into display bullets (sentences). */
export function splitExecutiveSummary(summary: string): string[] {
  return summary
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function formatGrowthVsPriorWeek(percent: number, template: string): string {
  const sign = percent >= 0 ? "+" : "";
  return template.replace("{sign}", sign).replace("{percent}", String(percent));
}

function comparisonPeriodForStart(periodStart: string): {
  comparisonPeriodStart: string;
  comparisonPeriodEnd: string;
} {
  const start = new Date(`${periodStart}T12:00:00.000Z`);
  const compEnd = new Date(start);
  compEnd.setUTCDate(compEnd.getUTCDate() - 1);
  const compStart = new Date(start);
  compStart.setUTCDate(compStart.getUTCDate() - 7);
  const fmt = (date: Date) => date.toISOString().slice(0, 10);
  return { comparisonPeriodStart: fmt(compStart), comparisonPeriodEnd: fmt(compEnd) };
}

/** Build a list row from a generate response (matches reports-list shape). */
export function buildWeeklyReportListItem(result: GenerateWeeklyReportResult): WeeklyReportListItem {
  const content = result.content;
  const comp = comparisonPeriodForStart(result.periodStart);
  const keyHighlights: ReportKeyHighlight[] = [];
  if (content?.keyWins[0]) {
    keyHighlights.push({ text: content.keyWins[0], tone: "positive" });
  }
  if (content?.needsAttention[0]) {
    keyHighlights.push({ text: content.needsAttention[0], tone: "negative" });
  }

  return {
    id: result.id,
    title: result.title,
    periodStart: result.periodStart,
    periodEnd: result.periodEnd,
    generatedAt: result.generatedAt,
    status: result.status,
    summaryKey: result.summaryKey,
    downloadUrl: result.downloadUrl,
    summary: content?.executiveSummary?.slice(0, 120) ?? "",
    revenueGrowthPercent: content?.periodMetrics?.revenueGrowthPercent ?? 0,
    opportunityCount: content?.opportunities?.length ?? 0,
    attentionCount: content?.needsAttention?.length ?? 0,
    keyHighlights,
    comparisonPeriodStart: comp.comparisonPeriodStart,
    comparisonPeriodEnd: comp.comparisonPeriodEnd,
  };
}
