"use client";

import { m, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";

import type { VoiceUiState } from "../../domain/constants/speech";
import type { RecordingStatus } from "../../domain/constants/speech";
import { VOICE_TRANSCRIBE_FAILED_COPY } from "../../domain/constants/message-status";

type Props = {
  recordingStatus: RecordingStatus;
  voiceUiState: VoiceUiState;
  voiceError: string | null;
  onRetryVoice?: () => void;
};

function getVoiceLabel(
  recordingStatus: RecordingStatus,
  voiceUiState: VoiceUiState,
  voiceError: string | null
) {
  if (voiceUiState === "error" || voiceError) {
    return VOICE_TRANSCRIBE_FAILED_COPY;
  }
  if (recordingStatus === "recording" || voiceUiState === "recording") {
    return "Merekam...";
  }
  if (recordingStatus === "processing" || voiceUiState === "uploading") {
    return "Mengunggah audio...";
  }
  if (voiceUiState === "processing") {
    return "Menyalin suara...";
  }
  if (voiceUiState === "speaking") {
    return "Memutar respons AI...";
  }
  return null;
}

function VoiceIcon({
  recordingStatus,
  voiceUiState,
}: {
  recordingStatus: RecordingStatus;
  voiceUiState: VoiceUiState;
}) {
  if (recordingStatus === "recording" || voiceUiState === "recording") {
    return <MicRoundedIcon sx={{ fontSize: 16 }} />;
  }
  if (recordingStatus === "processing" || voiceUiState === "uploading") {
    return <CloudUploadRoundedIcon sx={{ fontSize: 16 }} />;
  }
  if (voiceUiState === "processing") {
    return <GraphicEqRoundedIcon sx={{ fontSize: 16 }} />;
  }
  if (voiceUiState === "speaking") {
    return <VolumeUpRoundedIcon sx={{ fontSize: 16 }} />;
  }
  return <PsychologyRoundedIcon sx={{ fontSize: 16 }} />;
}

export default function VoiceStatusOverlay({
  recordingStatus,
  voiceUiState,
  voiceError,
  onRetryVoice,
}: Props) {
  const label = getVoiceLabel(recordingStatus, voiceUiState, voiceError);
  const isError = voiceUiState === "error" || Boolean(voiceError);
  const visible =
    Boolean(label) &&
    (isError || recordingStatus !== "idle" || voiceUiState !== "idle");

  return (
    <AnimatePresence>
      {visible && (
        <Box
          component={m.div}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          sx={{
            px: 2,
            pb: 0.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.75,
            color: isError ? "error.main" : "text.secondary",
          }}
        >
          <VoiceIcon recordingStatus={recordingStatus} voiceUiState={voiceUiState} />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {isError ? `🎤 ${label}` : label}
          </Typography>
          {isError && onRetryVoice && (
            <Typography
              component="button"
              type="button"
              variant="caption"
              onClick={onRetryVoice}
              sx={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "primary.main",
                fontWeight: 700,
                p: 0,
                font: "inherit",
              }}
            >
              Rekam Ulang
            </Typography>
          )}
        </Box>
      )}
    </AnimatePresence>
  );
}
