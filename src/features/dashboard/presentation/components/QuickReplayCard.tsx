"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import { enqueueSnackbar } from "notistack";

import { useCreateConversation } from "@/features/conversation/presentation/controller/conversation.controller";
import {
  formatDifficultyLabel,
  getTutorName,
} from "@/features/learning/domain/constants/characters";
import { getLastSession } from "@/features/learning/presentation/utils/last-session.storage";
import { parseSubscriptionError } from "@/features/subscription/domain/utils/parse-subscription-error";
import { FOCUS_HANDOFF_KEY } from "@/theme/animate/practice-session";

export default function QuickReplayCard() {
  const router = useRouter();
  const createConversation = useCreateConversation();
  const [lastSession] = useState(() => getLastSession());

  if (!lastSession) return null;

  const handleReplay = () => {
    createConversation.mutate(
      {
        characterId: lastSession.characterId,
        personality: lastSession.personality,
        language: "en",
        scenarioType: lastSession.scenarioType,
        difficulty: lastSession.difficulty,
        objective: lastSession.objective,
      },
      {
        onSuccess: (data) => {
          sessionStorage.setItem(FOCUS_HANDOFF_KEY, "1");
          router.push(`/conversation?id=${data.id}&focus=1`);
        },
        onError: (error) => {
          const parsed = parseSubscriptionError(error);
          if (parsed) {
            enqueueSnackbar(parsed.message, { variant: "warning" });
            return;
          }
          enqueueSnackbar("Gagal memulai quick replay", { variant: "error" });
        },
      }
    );
  };

  return (
    <Card
      component={m.button}
      type="button"
      disabled={createConversation.isPending}
      onClick={handleReplay}
      whileTap={{ scale: 0.98 }}
      sx={{
        p: 2,
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        border: "1px solid",
        borderColor: "primary.outline",
        bgcolor: "primary.tonalContainer",
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <ReplayRoundedIcon color="primary" />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
            Latihan Lagi
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {lastSession.scenarioLabel} · {getTutorName(lastSession.characterId)} ·{" "}
            {formatDifficultyLabel(lastSession.difficulty)}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
