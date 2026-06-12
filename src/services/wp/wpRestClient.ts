import type { ExpenzeyAiConfig } from "@/types/wp";

export class WpRestError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "WpRestError";
  }
}

function getConfig(): ExpenzeyAiConfig {
  if (!window.expenzeyAi) {
    throw new Error("WordPress config (window.expenzeyAi) is not available");
  }
  return window.expenzeyAi;
}

/**
 * Build a WordPress REST URL that works with both pretty permalinks (/wp-json/…)
 * and plain permalinks (index.php?rest_route=/…).
 *
 * `new URL(relative, base)` breaks when the base uses `rest_route` — the path
 * replaces `/index.php` and drops the query string entirely.
 */
export function buildWpRestUrl(restUrl: string, path: string): string {
  const trimmedPath = path.replace(/^\//, "");
  const [routeSuffix, pathQuery = ""] = trimmedPath.split("?");

  if (restUrl.includes("rest_route=")) {
    const url = new URL(restUrl);
    const restRoute = (url.searchParams.get("rest_route") ?? "").replace(/\/$/, "");
    url.searchParams.set("rest_route", `${restRoute}/${routeSuffix}`);

    if (pathQuery) {
      for (const [key, value] of new URLSearchParams(pathQuery)) {
        url.searchParams.set(key, value);
      }
    }

    return url.toString();
  }

  const base = restUrl.endsWith("/") ? restUrl : `${restUrl}/`;
  return pathQuery ? `${base}${routeSuffix}?${pathQuery}` : `${base}${routeSuffix}`;
}

export async function wpRestFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const config = getConfig();
  const url = buildWpRestUrl(config.restUrl, path);
  const headers = new Headers(init.headers);
  headers.set("X-WP-Nonce", config.nonce);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers,
    credentials: "same-origin",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new WpRestError(message || response.statusText, response.status);
  }

  return (await response.json()) as T;
}

export function isWpContext(): boolean {
  return Boolean(window.expenzeyAi?.isAdmin);
}
