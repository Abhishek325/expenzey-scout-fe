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

export async function wpRestFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const config = getConfig();
  const url = new URL(path.replace(/^\//, ""), config.restUrl).toString();
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
