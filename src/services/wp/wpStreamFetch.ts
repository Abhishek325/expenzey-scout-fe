import { buildWpRestUrl, WpRestError } from "@/services/wp/wpRestClient";

export interface SseHandlers {
  onStatus?: (text: string) => void;
  onToken?: (text: string) => void;
  onDone?: (data: Record<string, unknown>) => void;
  onMeta?: (data: Record<string, unknown>) => void;
  onError?: (message: string) => void;
}

function getConfig() {
  if (!window.expenzeyAi) {
    throw new Error("WordPress config (window.expenzeyAi) is not available");
  }
  return window.expenzeyAi;
}

export async function wpRestStream(
  path: string,
  body: unknown,
  handlers: SseHandlers,
): Promise<void> {
  const config = getConfig();
  const url = buildWpRestUrl(config.restUrl, path);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-WP-Nonce": config.nonce,
      Accept: "text/event-stream",
    },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new WpRestError(message || response.statusText, response.status);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Streaming is not supported in this browser.");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  const processBlock = (block: string) => {
    let event = "message";
    let data = "";
    for (const line of block.split("\n")) {
      if (line.startsWith("event:")) {
        event = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        data = line.slice(5).trim();
      }
    }
    if (!data) return;

    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(data) as Record<string, unknown>;
    } catch {
      parsed = { text: data };
    }

    if (event === "status" && typeof parsed.text === "string") {
      handlers.onStatus?.(parsed.text);
    } else if (event === "token" && typeof parsed.text === "string") {
      handlers.onToken?.(parsed.text);
    } else if (event === "done") {
      handlers.onDone?.(parsed);
    } else if (event === "meta") {
      handlers.onMeta?.(parsed);
    } else if (event === "error") {
      const message = typeof parsed.message === "string" ? parsed.message : "Chat failed";
      handlers.onError?.(message);
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let boundary = buffer.indexOf("\n\n");
    while (boundary !== -1) {
      const block = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      if (block.trim()) processBlock(block);
      boundary = buffer.indexOf("\n\n");
    }
  }

  if (buffer.trim()) {
    processBlock(buffer);
  }
}
