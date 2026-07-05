"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import CircularProgress from "@mui/material/CircularProgress";
import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import { alpha, keyframes } from "@mui/material/styles";

import type { RecordingStatus } from "../../domain/constants/speech";
import { getChatInputBorderRadius, hideScrollbarStyles } from "@/theme/scrollbar";
import { M3_EASING, M3_DURATION } from "@/theme/motion";

const recordingPulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.08); opacity: 0.85; }
`;

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  isSending?: boolean;
  recordingStatus?: RecordingStatus;
  onMicToggle?: () => void;
  isMicDisabled?: boolean;
  bottomOffset?: number;
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  autoFocus?: boolean;
};

const INPUT_MIN_HEIGHT = 52;
const MAX_ROWS = 4;

export default function ChatInputBar({
  value,
  onChange,
  onSend,
  disabled = false,
  isSending = false,
  recordingStatus = "idle",
  onMicToggle,
  isMicDisabled = false,
  bottomOffset = 0,
  inputRef,
  autoFocus = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(INPUT_MIN_HEIGHT);

  const measureHeight = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerHeight(el.getBoundingClientRect().height);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    measureHeight();

    const observer = new ResizeObserver(() => measureHeight());
    observer.observe(el);

    return () => observer.disconnect();
  }, [measureHeight, value]);

  const isRecording = recordingStatus === "recording";
  const isProcessingVoice = recordingStatus === "processing";
  const inputDisabled = disabled || isRecording || isProcessingVoice;
  const canSend = value.trim().length > 0 && !inputDisabled && !isSending;
  const borderRadius = getChatInputBorderRadius(
    containerHeight,
    INPUT_MIN_HEIGHT,
    MAX_ROWS
  );
  const isMultiline = containerHeight > INPUT_MIN_HEIGHT + 6;

  const micTitle = isRecording
    ? "Ketuk untuk berhenti merekam"
    : isProcessingVoice
      ? "Memproses rekaman..."
      : "Rekam suara";

  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: bottomOffset,
        px: 2,
        pb: 1.5,
        pt: 3,
        display: "flex",
        alignItems: "flex-end",
        gap: 1.5,
        pointerEvents: "none",
        background: (theme) =>
          `linear-gradient(180deg, transparent 0%, ${theme.palette.background.default} 55%)`,
        transition: `bottom ${M3_DURATION.medium}ms ${M3_EASING.emphasizedDecelerate}`,
        "& > *": { pointerEvents: "auto" },
      }}
    >
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          minHeight: INPUT_MIN_HEIGHT,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          pl: 2,
          pr: 1,
          py: isMultiline ? 0.75 : 0,
          bgcolor: "background.surfaceContainerHigh",
          borderRadius: `${borderRadius}px`,
          boxShadow: "none",
          transition: `border-radius ${M3_DURATION.medium}ms ${M3_EASING.emphasizedDecelerate}`,
          outline: isRecording ? "2px solid" : "none",
          outlineColor: isRecording ? "error.main" : "transparent",
          outlineOffset: 0,
        }}
      >
        <InputBase
          fullWidth
          multiline
          maxRows={MAX_ROWS}
          inputRef={inputRef}
          autoFocus={autoFocus}
          placeholder={isRecording ? "Sedang merekam..." : "Ketik pesanmu..."}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={inputDisabled}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (canSend) onSend();
            }
          }}
          sx={{
            flex: 1,
            py: 1.25,
            fontSize: 16,
            fontWeight: 500,
            lineHeight: 1.5,
            alignSelf: isMultiline ? "stretch" : "center",
            ...hideScrollbarStyles,
            "& .MuiInputBase-input": {
              lineHeight: 1.5,
              "&::placeholder": { opacity: 0.55 },
            },
            "& textarea": {
              overflow: "auto !important",
              resize: "none",
              ...hideScrollbarStyles,
            },
          }}
        />

        <IconButton
          onClick={onMicToggle}
          disabled={isMicDisabled || !onMicToggle}
          title={micTitle}
          aria-label={micTitle}
          aria-pressed={isRecording}
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            mb: isMultiline ? 0.25 : 0,
            color: isRecording ? "error.main" : "text.secondary",
            bgcolor: (theme) =>
              isRecording ? alpha(theme.palette.error.main, 0.12) : "transparent",
            animation: isRecording
              ? `${recordingPulse} 1.2s ease-in-out infinite`
              : "none",
            "&:hover": {
              bgcolor: (theme) =>
                isRecording
                  ? alpha(theme.palette.error.main, 0.16)
                  : theme.palette.action.hover,
            },
          }}
        >
          {isProcessingVoice ? (
            <CircularProgress size={20} color="inherit" />
          ) : isRecording ? (
            <StopRoundedIcon fontSize="small" />
          ) : (
            <GraphicEqRoundedIcon fontSize="small" />
          )}
        </IconButton>

        <IconButton
          onClick={onSend}
          size="small"
          disabled={!canSend}
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            mb: isMultiline ? 0.25 : 0,
            color: canSend ? "primary.main" : "action.disabled",
          }}
        >
          {isSending ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <SendRoundedIcon fontSize="small" />
          )}
        </IconButton>
      </Box>
    </Box>
  );
}
