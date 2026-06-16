import {
  normalizeChatLinks,
  type IChatService,
  type SendMessageOptions,
  type SendMessageResult,
} from "@/services/chat/IChatService";
import { wpRestFetch } from "@/services/wp/wpRestClient";
import { wpRestStream } from "@/services/wp/wpStreamFetch";
import type { ChatConversation, ChatMessage } from "@/types/chat";

export class WpChatService implements IChatService {
  async listConversations(): Promise<ChatConversation[]> {
    return wpRestFetch<ChatConversation[]>("/chat/conversations");
  }

  async createConversation(title = "New conversation"): Promise<ChatConversation> {
    return wpRestFetch<ChatConversation>("/chat/conversations", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  }

  async getMessages(conversationId: number): Promise<ChatMessage[]> {
    return wpRestFetch<ChatMessage[]>(`/chat/conversations/${conversationId}/messages`);
  }

  async getProductLink(wcProductId: number): Promise<string> {
    const result = await wpRestFetch<{ url: string }>(`/chat/product-link/${wcProductId}`);
    return result.url;
  }

  async sendMessage(content: string, options: SendMessageOptions = {}): Promise<SendMessageResult> {
    let conversationId = options.conversationId;
    let assistantContent = "";
    let links: ChatMessage["links"] = [];
    let suggestedTitle: string | undefined;
    let messageId: string = crypto.randomUUID();
    let statusText = "";

    await wpRestStream(
      "/chat/message",
      {
        message: content,
        conversationId,
        start: options.start,
        end: options.end,
      },
      {
        onStatus: (text) => {
          statusText = text;
          options.onStatus?.(text);
        },
        onToken: (text) => {
          assistantContent += text;
          options.onToken?.(text);
        },
        onDone: (data) => {
          if (typeof data.content === "string") {
            assistantContent = data.content;
          }
          links = normalizeChatLinks(data.links);
          if (typeof data.suggestedTitle === "string") {
            suggestedTitle = data.suggestedTitle;
          }
          if (typeof data.id === "string") {
            messageId = data.id;
          }
        },
        onMeta: (data) => {
          if (typeof data.conversationId === "number") {
            conversationId = data.conversationId;
          }
          if (typeof data.messageId === "string") {
            messageId = data.messageId;
          }
        },
        onError: (message) => {
          throw new Error(message);
        },
      },
    );

    if (!conversationId) {
      const conversations = await this.listConversations();
      conversationId = conversations[0]?.id ?? (await this.createConversation()).id;
    }

    return {
      conversationId,
      suggestedTitle,
      message: {
        id: messageId,
        role: "assistant",
        content: assistantContent,
        links,
        statusText: statusText || undefined,
        createdAt: new Date().toISOString(),
      },
    };
  }
}
