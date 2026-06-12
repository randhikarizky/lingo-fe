"use client";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";

import InlineCorrectionText from "@/global/components/Text/InlineCorrectionText";
import type { ChatMessageEntity } from "../../domain/entities/chat-message.entity";

type Props = {
  message: ChatMessageEntity;
  personalityEmoji?: string;
  speechLocale?: string;
  onPlayCorrection?: (text: string, locale: string) => void;
};

export default function ChatMessageBubble({
  message,
  personalityEmoji = "🤖",
  speechLocale = "en-US",
  onPlayCorrection,
}: Props) {
  const isUser = message.role === "user";
  const showPlayButton = !isUser && Boolean(message.correctionAudioText);

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
          sx={{
            px: 2,
            py: 1.25,
            borderRadius: isUser ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
            bgcolor: isUser ? "primary.main" : "background.paper",
            color: isUser ? "primary.contrastText" : "text.primary",
            border: isUser ? "none" : "1px solid",
            borderColor: "divider",
            boxShadow: "none",
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
          <InlineCorrectionText content={message.content} variant="body2" />
        </Box>

        {showPlayButton && (
          <Button
            size="small"
            variant={message.needsManualPlay ? "contained" : "text"}
            color="secondary"
            startIcon={<VolumeUpRoundedIcon fontSize="small" />}
            onClick={() =>
              onPlayCorrection?.(message.correctionAudioText!, speechLocale)
            }
            sx={{
              alignSelf: "flex-start",
              ml: 0.5,
              minHeight: 32,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {message.needsManualPlay ? "Putar artikulasi" : "Putar ulang artikulasi"}
          </Button>
        )}
      </Box>
    </Box>
  );
}
