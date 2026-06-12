import type { VoiceRecording } from "../constants/speech";

function getRecordingFileName(mimeType: string) {
  if (mimeType.includes("mp4") || mimeType.includes("m4a")) {
    return "recording.mp4";
  }

  if (mimeType.includes("mpeg") || mimeType.includes("mp3")) {
    return "recording.mp3";
  }

  if (mimeType.includes("wav")) {
    return "recording.wav";
  }

  return "recording.webm";
}

export function buildRecordingFormData(
  recording: VoiceRecording,
  params: { language: string; conversationId: string }
) {
  const formData = new FormData();
  const fileName = getRecordingFileName(recording.mimeType);

  formData.append(
    "audio",
    new File([recording.blob], fileName, { type: recording.mimeType })
  );
  formData.append("language", params.language);
  formData.append("conversationId", params.conversationId);

  return formData;
}
