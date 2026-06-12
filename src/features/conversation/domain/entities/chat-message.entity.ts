export type ChatRole = "user" | "assistant" | "system";

export type ChatMessageEntity = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  correctionAudioText?: string;
  needsManualPlay?: boolean;
};

export type AiModel = "gpt-5-2" | "gemini-2.5-pro";
