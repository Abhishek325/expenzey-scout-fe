import type { ChatLink } from "@/types/chat";

export interface LinkSegment {
  type: "text" | "link";
  value: string;
  link?: ChatLink;
}

export function buildLinkSegments(content: string, links: ChatLink[] = []): LinkSegment[] {
  if (!content || links.length === 0) {
    return [{ type: "text", value: content }];
  }

  const sorted = [...links].sort((a, b) => b.label.length - a.label.length);
  const segments: LinkSegment[] = [];
  let cursor = 0;
  const lower = content.toLowerCase();

  while (cursor < content.length) {
    let match: { index: number; link: ChatLink } | null = null;

    for (const link of sorted) {
      const index = lower.indexOf(link.label.toLowerCase(), cursor);
      if (index === -1) continue;
      if (!match || index < match.index) {
        match = { index, link };
      }
    }

    if (!match) {
      segments.push({ type: "text", value: content.slice(cursor) });
      break;
    }

    if (match.index > cursor) {
      segments.push({ type: "text", value: content.slice(cursor, match.index) });
    }

    const label = content.slice(match.index, match.index + match.link.label.length);
    segments.push({ type: "link", value: label, link: match.link });
    cursor = match.index + match.link.label.length;
  }

  return segments.length > 0 ? segments : [{ type: "text", value: content }];
}

export function shufflePrompts(prompts: string[]): string[] {
  const copy = [...prompts];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
