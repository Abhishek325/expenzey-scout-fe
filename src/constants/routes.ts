export const ROUTES = {
  ROOT: "/",
  DASHBOARD: "/dashboard",
  OPPORTUNITIES: "/opportunities",
  REPORTS: "/reports",
  REPORT_DETAIL: "/reports/:id",
  REVIEWS: "/reviews",
  SETTINGS: "/settings",
  PRO: "/pro",
  ONBOARDING: "/onboarding",
  ONBOARDING_WELCOME: "/onboarding/welcome",
  ONBOARDING_CONNECT: "/onboarding/connect",
} as const;

export function reportDetailPath(id: string): string {
  return `${ROUTES.REPORTS}/${encodeURIComponent(id)}`;
}

export function isOnboardingPath(path: string): boolean {
  return path === ROUTES.ONBOARDING || path.startsWith(`${ROUTES.ONBOARDING}/`);
}
