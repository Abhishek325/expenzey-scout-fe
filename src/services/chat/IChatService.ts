import type { ChatMessage } from "@/types/chat";

export interface IChatService {
  getMessages(): Promise<ChatMessage[]>;
  sendMessage(content: string): Promise<ChatMessage>;
}

export const CHAT_SERVICE_KEY = "chatService";
