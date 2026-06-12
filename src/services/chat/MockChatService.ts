import mockChat from "@/data/chat/mock-chat-messages.json";
import { simulateDelay } from "@/services/delay";
import type { IChatService } from "@/services/chat/IChatService";
import type { ChatMessage } from "@/types/chat";

const STATIC_REPLY =
  "Based on your recent sales data, revenue is trending up week over week. Consider promoting your top-performing products.";

export class MockChatService implements IChatService {
  private messages: ChatMessage[] = [];

  async getMessages(): Promise<ChatMessage[]> {
    await simulateDelay();
    if (this.messages.length === 0 && mockChat.defaultGreeting) {
      const greeting: ChatMessage = {
        id: "greeting",
        role: mockChat.defaultGreeting.role as ChatMessage["role"],
        contentKey: mockChat.defaultGreeting.contentKey,
        createdAt: new Date().toISOString(),
      };
      return [greeting];
    }
    return [...this.messages];
  }

  async sendMessage(content: string): Promise<ChatMessage> {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(userMessage);

    await simulateDelay();

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: STATIC_REPLY,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(assistantMessage);
    return assistantMessage;
  }
}
