"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import InlineCorrectionText from "@/global/components/Text/InlineCorrectionText";
import {
  ASSISTANT_FAILED_COPY,
  VOICE_PLAYBACK_FAILED_COPY,
} from "../../domain/constants/message-status";
import type { ChatMessageEntity } from "../../domain/entities/chat-message.entity";
import MessageDeliveryIcon from "./MessageDeliveryIcon";
import ThinkingDots from "./ThinkingDots";

type Props = {
  message: ChatMessageEntity;
  personalityEmoji?: string;
  tutorName?: string;
  onPlaySpeech?: (text: string, messageId: string) => void;
  isSpeechPlaying?: boolean;
  onRetryUser?: (messageId: string) => void;
  onDeleteUser?: (messageId: string) => void;
  onRetryAssistant?: (messageId: string) => void;
  onRetrySpeech?: (messageId: string, text: string) => void;
};

export default function ChatMessageBubble({
  message,
  personalityEmoji = "🤖",
  tutorName = "Tutor",
  onPlaySpeech,
  isSpeechPlaying = false,
  onRetryUser,
  onDeleteUser,
  onRetryAssistant,
  onRetrySpeech,
}: Props) {
  const isUser = message.role === "user";
  const [showFailedActions, setShowFailedActions] = useState(false);
  const isThinking =
    message.assistantStatus === "thinking" || message.assistantStatus === "retrying";
  const isAssistantFailed = message.assistantStatus === "failed";
  const isUserFailed = message.deliveryStatus === "failed";
  const speechText = message.speechAudioText ?? message.correctionAudioText;
  const speechFailed = message.speechPlaybackStatus === "failed";
  const showPlayButton =
    !isUser &&
    !isThinking &&
    !isAssistantFailed &&
    Boolean(speechText) &&
    onPlaySpeech &&
    !speechFailed;

  const toggleFailedActions = () => {
    if (isUserFailed || isAssistantFailed) {
      setShowFailedActions((prev) => !prev);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        gap: 1,
      }}
    >
      {!isUser && (
        <Avatar
          aria-label={tutorName}
          sx={{
            width: 32,
            height: 32,
            fontSize: 16,
            bgcolor: "secondary.tonalContainer",
            color: "secondary.onTonalContainer",
            flexShrink: 0,
          }}
        >
          {personalityEmoji}
        </Avatar>
      )}

      <Box sx={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: 0.75 }}>
        <Box
          onClick={toggleFailedActions}
          sx={{
            position: "relative",
            px: 2,
            py: 1.25,
            pr:
              isUser && message.deliveryStatus && message.deliveryStatus !== "sent"
                ? 3
                : 2,
            borderRadius: isUser ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
            bgcolor: isUser ? "primary.main" : "background.paper",
            color: isUser ? "primary.contrastText" : "text.primary",
            border: isUser ? "none" : "1px solid",
            borderColor: isAssistantFailed || isUserFailed ? "error.main" : "divider",
            boxShadow: "none",
            cursor: isUserFailed || isAssistantFailed ? "pointer" : "default",
            opacity:
              message.deliveryStatus === "sending" ||
              message.deliveryStatus === "retrying"
                ? 0.92
                : 1,
            "& .MuiTypography-root": {
              color: "inherit",
            },
            "& ins": {
              color: isUser ? "#B8F5D0" : "success.main",
            },
            "& del": {
              color: isUser ? "#FFD0CC" : "error.main",
            },
          }}
        >
          {isThinking ? (
            <Stack spacing={0.5}>
              <ThinkingDots />
            </Stack>
          ) : isAssistantFailed ? (
            <Typography variant="body2">
              {message.content || ASSISTANT_FAILED_COPY}
            </Typography>
          ) : (
            <InlineCorrectionText content={message.content} variant="body2" />
          )}

          <MessageDeliveryIcon status={message.deliveryStatus} isUser={isUser} />
        </Box>

        {(isUserFailed || isAssistantFailed) && (showFailedActions || isUserFailed) && (
          <Stack
            direction="row"
            spacing={0.75}
            sx={{ alignSelf: isUser ? "flex-end" : "flex-start", ml: isUser ? 0 : 0.5 }}
          >
            {isUserFailed && onRetryUser && (
              <Button
                size="small"
                variant="outlined"
                color="inherit"
                startIcon={<RefreshRoundedIcon fontSize="small" />}
                onClick={() => onRetryUser(message.id)}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 30,
                }}
              >
                Coba Lagi
              </Button>
            )}
            {isUserFailed && onDeleteUser && (
              <Button
                size="small"
                variant="text"
                color="inherit"
                startIcon={<DeleteOutlineRoundedIcon fontSize="small" />}
                onClick={() => onDeleteUser(message.id)}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 30,
                }}
              >
                Hapus
              </Button>
            )}
            {isAssistantFailed && onRetryAssistant && (
              <Button
                size="small"
                variant="outlined"
                color="inherit"
                startIcon={<RefreshRoundedIcon fontSize="small" />}
                onClick={() => onRetryAssistant(message.id)}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 30,
                }}
              >
                Coba Lagi
              </Button>
            )}
          </Stack>
        )}

        {showPlayButton && (
          <Button
            size="small"
            variant={message.needsManualPlay ? "contained" : "text"}
            color="secondary"
            startIcon={<VolumeUpRoundedIcon fontSize="small" />}
            onClick={() => onPlaySpeech?.(speechText!, message.id)}
            disabled={isSpeechPlaying}
            sx={{
              alignSelf: "flex-start",
              ml: 0.5,
              minHeight: 32,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {message.needsManualPlay ? "Putar respons" : "Putar ulang respons"}
          </Button>
        )}

        {speechFailed && speechText && onRetrySpeech && (
          <Stack spacing={0.5} sx={{ ml: 0.5 }}>
            <Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
              🔊 {VOICE_PLAYBACK_FAILED_COPY}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<VolumeUpRoundedIcon fontSize="small" />}
              onClick={() => onRetrySpeech(message.id, speechText)}
              disabled={isSpeechPlaying}
              sx={{
                alignSelf: "flex-start",
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Putar Lagi
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
