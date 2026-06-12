import { AiModel } from "../../domain/entities/chat-message.entity";

export type ChatResponse = {
  content: string;
  mock: boolean;
  model: AiModel;
};
