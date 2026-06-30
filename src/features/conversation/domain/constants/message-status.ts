export type UserDeliveryStatus = "sending" | "sent" | "failed" | "retrying";

export type AssistantStatus = "thinking" | "completed" | "failed" | "retrying";

export type SpeechPlaybackStatus = "idle" | "failed";

export type ApiErrorCode =
  | "NETWORK_TIMEOUT"
  | "AI_PROVIDER_ERROR"
  | "VOICE_PROVIDER_ERROR"
  | "QUOTA_EXCEEDED"
  | "RATE_LIMITED"
  | "UNAUTHORIZED"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR"
  | "SERVICE_UNAVAILABLE";

export const ASSISTANT_FAILED_COPY =
  "Maaf, aku mengalami gangguan saat menyusun jawaban.";

export const VOICE_TRANSCRIBE_FAILED_COPY = "Audio tidak dapat diproses.";

export const VOICE_PLAYBACK_FAILED_COPY = "Audio gagal diputar.";
