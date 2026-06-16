import type { ChatConversation, ChatLink, ChatMessage } from "@/types/chat";

export interface SendMessageOptions {
  conversationId?: number;
  start?: string;
  end?: string;
  onStatus?: (text: string) => void;
  onToken?: (text: string) => void;
}

export interface SendMessageResult {
  message: ChatMessage;
  conversationId: number;
  suggestedTitle?: string;
}

export interface IChatService {
  listConversations(): Promise<ChatConversation[]>;
  createConversation(title?: string): Promise<ChatConversation>;
  getMessages(conversationId: number): Promise<ChatMessage[]>;
  getProductLink(wcProductId: number): Promise<string>;
  sendMessage(content: string, options?: SendMessageOptions): Promise<SendMessageResult>;
}

export const CHAT_SERVICE_KEY = "chatService";

export function normalizeChatLinks(raw: unknown): ChatLink[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is ChatLink => {
    if (!item || typeof item !== "object") return false;
    const link = item as ChatLink;
    if (link.type === "product") {
      return typeof link.wcProductId === "number" && typeof link.label === "string";
    }
    if (link.type === "opportunity") {
      return typeof link.id === "string" && typeof link.label === "string";
    }
    return false;
  });
}
