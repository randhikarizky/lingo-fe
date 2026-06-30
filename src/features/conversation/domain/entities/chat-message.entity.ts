import type {
  AssistantStatus,
  SpeechPlaybackStatus,
  UserDeliveryStatus,
} from "../constants/message-status";

export type ChatRole = "user" | "assistant" | "system";

export type ChatMessageEntity = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  deliveryStatus?: UserDeliveryStatus;
  assistantStatus?: AssistantStatus;
  errorMessage?: string;
  errorCode?: string;
  correctionAudioText?: string;
  speechAudioText?: string;
  needsManualPlay?: boolean;
  speechPlaybackStatus?: SpeechPlaybackStatus;
};

export type AiModel = "gpt-5-2" | "gemini-2.5-pro";
