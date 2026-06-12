import type { IChatService } from "@/services/chat/IChatService";
import type { ChatMessage } from "@/types/chat";

export class WpChatService implements IChatService {
  async getMessages(): Promise<ChatMessage[]> {
    throw new Error("Not implemented");
  }

  async sendMessage(_content: string): Promise<ChatMessage> {
    throw new Error("Not implemented");
  }
}
