import type { ReviewIntelligence, ReviewIntelligenceDetail } from "@/types/ai";

function countFromPercent(total: number, percent: number): number {
  if (total <= 0) return 0;
  return Math.round((total * percent) / 100);
}

export function normalizeReviewIntelligenceDetail(
  raw: ReviewIntelligenceDetail | ReviewIntelligence,
): ReviewIntelligenceDetail {
  const totalReviews = raw.totalReviews ?? 0;
  const sentiment = raw.sentiment ?? { positive: 0, neutral: 0, negative: 0 };
  const detail = raw as ReviewIntelligenceDetail;

  const positiveCount = "positiveCount" in sentiment
    ? (sentiment.positiveCount ?? 0)
    : countFromPercent(totalReviews, sentiment.positive);
  const neutralCount = "neutralCount" in sentiment
    ? (sentiment.neutralCount ?? 0)
    : countFromPercent(totalReviews, sentiment.neutral);
  const negativeCount = "negativeCount" in sentiment
    ? (sentiment.negativeCount ?? 0)
    : countFromPercent(totalReviews, sentiment.negative);

  let positiveThemes = Array.isArray(detail.positiveThemes) ? detail.positiveThemes : [];
  if (positiveThemes.length === 0 && positiveCount > 0) {
    positiveThemes = [{
      theme: "overall",
      count: positiveCount,
      percentOfPositive: 100,
    }];
  }

  return {
    averageRating: raw.averageRating ?? 0,
    totalReviews,
    sentiment: {
      positive: sentiment.positive ?? 0,
      positiveCount,
      neutral: sentiment.neutral ?? 0,
      neutralCount,
      negative: sentiment.negative ?? 0,
      negativeCount,
    },
    positiveThemes: positiveThemes,
    complaintThemes: Array.isArray(detail.complaintThemes) ? detail.complaintThemes : [],
    sentimentTrend: Array.isArray(detail.sentimentTrend) ? detail.sentimentTrend : [],
    recentReviews: raw.recentReviews ?? [],
    recentNegativeReviews: Array.isArray(detail.recentNegativeReviews)
      ? detail.recentNegativeReviews
      : [],
  };
}
