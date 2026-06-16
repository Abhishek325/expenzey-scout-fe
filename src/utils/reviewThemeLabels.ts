import { resolveStringKey } from "@/composables/dashboard/resolveStringKey";
import type { IStringService } from "@/services/stringService";

export type ReviewThemeLabelPrefix =
  | "dashboard.aiInsights.reviewIntelligence.themes.positive"
  | "dashboard.aiInsights.reviewIntelligence.themes.complaint";

export function resolveReviewThemeLabel(
  stringService: IStringService,
  theme: string,
  prefix: ReviewThemeLabelPrefix,
): string {
  const key = `${prefix}.${theme}`;
  return resolveStringKey(stringService, key);
}

export function mapReviewThemeLabels(
  themes: string[],
  stringService: IStringService,
  prefix: ReviewThemeLabelPrefix,
): string[] {
  return themes.map((theme) => resolveReviewThemeLabel(stringService, theme, prefix));
}

export function mapReviewThemeDetails<T extends { theme: string }>(
  themes: T[],
  stringService: IStringService,
  prefix: ReviewThemeLabelPrefix,
): Array<T & { label: string }> {
  return (themes ?? []).map((entry) => ({
    ...entry,
    label: resolveReviewThemeLabel(stringService, entry.theme, prefix),
  }));
}
