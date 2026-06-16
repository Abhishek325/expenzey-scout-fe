export type ChatRole = "user" | "assistant";

export type ChatLink =
  | { type: "product"; wcProductId: number; label: string; url?: string }
  | { type: "opportunity"; id: string; label: string };

export interface ChatConversation {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content?: string;
  contentKey?: string;
  links?: ChatLink[];
  streaming?: boolean;
  statusText?: string;
  createdAt: string;
}
