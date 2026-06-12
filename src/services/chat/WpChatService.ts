import type { IChatService } from "@/services/chat/IChatService";
import { wpRestFetch } from "@/services/wp/wpRestClient";
import type { ChatMessage } from "@/types/chat";

export class WpChatService implements IChatService {
  async getMessages(): Promise<ChatMessage[]> {
    return [];
  }

  async sendMessage(content: string): Promise<ChatMessage> {
    return wpRestFetch<ChatMessage>("/chat/message", {
      method: "POST",
      body: JSON.stringify({ message: content }),
    });
  }
}
