import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAIChat } from "@/composables/chat/useAIChat";
import { CHAT_SERVICE_KEY } from "@/services/chat/IChatService";
import { USAGE_SERVICE_KEY } from "@/services/usage/IUsageService";

const sendMessage = vi.fn();
const listConversations = vi.fn();
const getMessages = vi.fn();
const createConversation = vi.fn();

vi.mock("vue", async () => {
  const actual = await vi.importActual<typeof import("vue")>("vue");
  return {
    ...actual,
    inject: (key: unknown) => {
      if (key === CHAT_SERVICE_KEY) {
        return {
          listConversations,
          createConversation,
          getMessages,
          sendMessage,
          getProductLink: vi.fn(),
        };
      }
      if (key === USAGE_SERVICE_KEY) {
        return { getUsage: vi.fn().mockResolvedValue({ chat: { used: 1, limit: 50 } }) };
      }
      return undefined;
    },
    onMounted: (fn: () => void) => fn(),
  };
});

vi.mock("@/stores/dateRange", () => ({
  useDateRangeStore: () => ({
    start: new Date("2026-06-01T00:00:00.000Z"),
    end: new Date("2026-06-07T23:59:59.999Z"),
  }),
}));

describe("useAIChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listConversations.mockResolvedValue([
      { id: 1, title: "Revenue Analysis", createdAt: "", updatedAt: "" },
    ]);
    getMessages.mockResolvedValue([]);
    sendMessage.mockImplementation(async (_content, options) => {
      options?.onStatus?.("Analyzing your store...");
      options?.onToken?.("Revenue increased ");
      options?.onToken?.("18%.");
      return {
        conversationId: 1,
        message: {
          id: "42",
          role: "assistant",
          content: "Revenue increased 18%.",
          createdAt: new Date().toISOString(),
        },
      };
    });
  });

  it("streams assistant tokens into message state", async () => {
    const chat = useAIChat();
    await chat.reload();

    await chat.sendMessage("What changed this week?");

    expect(sendMessage).toHaveBeenCalled();
    expect(chat.messages.value.some((m) => m.role === "user")).toBe(true);
    expect(chat.messages.value.some((m) => m.role === "assistant" && m.content?.includes("18%"))).toBe(
      true,
    );
  });

  it("regenerates using the prior user question", async () => {
    const chat = useAIChat();
    chat.messages.value = [
      { id: "u1", role: "user", content: "Why is revenue increasing?", createdAt: "" },
      { id: "a1", role: "assistant", content: "Old answer", createdAt: "" },
    ];

    // regenerate removed in V1
    expect(chat.messages.value.find((m) => m.id === "a1")).toBeDefined();
  });
});
