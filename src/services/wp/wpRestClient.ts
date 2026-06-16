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

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "").trim();
}

/** Extract a user-facing message from a WordPress REST error response body. */
export function parseWpRestErrorBody(raw: string, fallback: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return fallback;

  try {
    const parsed = JSON.parse(trimmed) as { message?: string };
    if (typeof parsed.message === "string") {
      const message = stripHtml(parsed.message).trim();
      if (message) return message;
    }
  } catch {
    if (!trimmed.startsWith("{") && !trimmed.startsWith("<")) {
      return stripHtml(trimmed) || fallback;
    }
  }

  return fallback;
}

export function getWpRestErrorMessage(error: unknown, fallback = "Request failed"): string {
  if (error instanceof WpRestError) {
    return error.message || fallback;
  }
  if (error instanceof Error) {
    return parseWpRestErrorBody(error.message, error.message || fallback);
  }
  return fallback;
}

type WpRestCacheEntry = {
  expiresAt: number;
  value: unknown;
};

type WpRestInflightEntry = {
  expiresAt: number;
  promise: Promise<unknown>;
};

const DEFAULT_CACHE_TTL_MS = 60_000;
const restCache = new Map<string, WpRestCacheEntry>();
const inflight = new Map<string, WpRestInflightEntry>();

export function clearWpRestCache(): void {
  restCache.clear();
  inflight.clear();
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

type WpRestFetchOptions = RequestInit & {
  /**
   * Override the default 60s in-memory cache TTL.
   * - Only applies to GET requests.
   * - Set to 0 to disable caching for a specific call.
   */
  cacheTtlMs?: number;
};

function resolveCacheKey(method: string, url: string): string {
  return `${method.toUpperCase()} ${url}`;
}

function getCachedValue<T>(key: string, now: number): T | null {
  const entry = restCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= now) {
    restCache.delete(key);
    return null;
  }
  return entry.value as T;
}

export function primeWpRestCache<T>(args: {
  method?: string;
  url: string;
  value: T;
  ttlMs?: number;
}): void {
  const method = (args.method ?? "GET").toUpperCase();
  const ttl = args.ttlMs ?? DEFAULT_CACHE_TTL_MS;
  if (ttl <= 0) return;
  const now = Date.now();
  const key = resolveCacheKey(method, args.url);
  restCache.set(key, { value: args.value, expiresAt: now + ttl });
}

export async function wpRestFetch<T>(
  path: string,
  init: WpRestFetchOptions = {}
): Promise<T> {
  const config = getConfig();
  const url = buildWpRestUrl(config.restUrl, path);
  const method = (init.method ?? "GET").toUpperCase();
  const cacheTtlMs = init.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;
  const useCache = method === "GET" && cacheTtlMs > 0;
  const now = Date.now();

  if (useCache) {
    const key = resolveCacheKey(method, url);
    const cached = getCachedValue<T>(key, now);
    if (cached !== null) {
      return cached;
    }

    const inflightEntry = inflight.get(key);
    if (inflightEntry && inflightEntry.expiresAt > now) {
      return inflightEntry.promise as Promise<T>;
    }
  }

  const headers = new Headers(init.headers);
  headers.set("X-WP-Nonce", config.nonce);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const requestPromise = (async () => {
    const response = await fetch(url, {
      ...init,
      headers,
      credentials: "same-origin",
    });

    if (!response.ok) {
      const raw = await response.text();
      const message = parseWpRestErrorBody(raw, response.statusText || "Request failed");
      throw new WpRestError(message, response.status);
    }

    return (await response.json()) as T;
  })();

  if (!useCache) {
    return requestPromise;
  }

  const key = resolveCacheKey(method, url);
  inflight.set(key, { promise: requestPromise, expiresAt: now + cacheTtlMs });

  try {
    const data = await requestPromise;
    restCache.set(key, { value: data, expiresAt: Date.now() + cacheTtlMs });
    return data;
  } finally {
    inflight.delete(key);
  }
}

export function isWpContext(): boolean {
  return Boolean(window.expenzeyAi?.isAdmin);
}
