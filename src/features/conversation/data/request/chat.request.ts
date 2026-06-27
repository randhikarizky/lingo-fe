import { AiModel } from "../../domain/entities/chat-message.entity";

export type ChatApiMessage = {
  role: "system" | "user" | "assistant" | "developer";
  content: string;
};

export type ChatRequest = {
  messages: ChatApiMessage[];
  model?: AiModel;
  conversationId?: string;
};
