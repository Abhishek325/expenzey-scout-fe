import { describe, expect, it } from "vitest";
import { buildLinkSegments, shufflePrompts } from "@/utils/chatLinks";
import type { ChatLink } from "@/types/chat";

describe("buildLinkSegments", () => {
  it("returns plain text when no links are provided", () => {
    expect(buildLinkSegments("Revenue increased 18%.")).toEqual([
      { type: "text", value: "Revenue increased 18%." },
    ]);
  });

  it("wraps mentioned product names as link segments", () => {
    const links: ChatLink[] = [
      { type: "product", wcProductId: 1, label: "Brand Buttons" },
    ];

    const segments = buildLinkSegments("Brand Buttons generated 24% of revenue.", links);
    expect(segments).toEqual([
      { type: "link", value: "Brand Buttons", link: links[0] },
      { type: "text", value: " generated 24% of revenue." },
    ]);
  });
});

describe("shufflePrompts", () => {
  it("returns all prompts in shuffled order", () => {
    const input = ["a", "b", "c", "d"];
    const output = shufflePrompts(input);
    expect(output.sort()).toEqual(input.sort());
  });
});
