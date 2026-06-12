export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content?: string;
  contentKey?: string;
  createdAt: string;
}
