export const RECORDING_MIME_TYPES = [
  "audio/mp4",
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/aac",
] as const;

export const MIN_RECORDING_MS = 500;
export const MAX_RECORDING_MS = 60_000;

export type RecordingStatus = "idle" | "recording" | "processing";

export type VoiceRecording = {
  blob: Blob;
  mimeType: string;
  durationMs: number;
};
