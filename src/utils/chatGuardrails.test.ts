import { describe, expect, it } from "vitest";
import { GUARDRAIL_REPLY, isOffTopicMessage } from "../../../supabase/functions/_shared/chat-guardrails.ts";

describe("isOffTopicMessage", () => {
  it("blocks jokes and general requests", () => {
    expect(isOffTopicMessage("Tell me a joke")).toBe(true);
    expect(isOffTopicMessage("Write me a blog post about shoes")).toBe(true);
    expect(isOffTopicMessage("Explain JavaScript closures")).toBe(true);
    expect(isOffTopicMessage("Generate a marketing email for summer")).toBe(true);
  });

  it("allows store-related questions", () => {
    expect(isOffTopicMessage("How did revenue perform this week?")).toBe(false);
    expect(isOffTopicMessage("Which products need attention?")).toBe(false);
    expect(isOffTopicMessage("What are customers complaining about?")).toBe(false);
    expect(isOffTopicMessage("Show growth opportunities")).toBe(false);
  });

  it("returns guardrail copy constant", () => {
    expect(GUARDRAIL_REPLY).toContain("WooCommerce store data");
  });
});
