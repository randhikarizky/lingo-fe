"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LoadingTips from "@/global/components/Loading/LoadingTips";
import { useGetConversationDetail } from "@/features/conversation/presentation/controller/conversation.controller";
import { CHARACTER_EMOJIS, getTutorName } from "../../domain/constants/characters";
import type {
  SessionGoal,
  SessionMetrics,
  SessionSummaryFeedback,
} from "../../domain/entities/learning-session.entity";
import { buildTutorCongrats } from "../utils/mission-summary.utils";
import MissionCompleteIntro from "./mission-summary/MissionCompleteIntro";
import MissionSummaryContent from "./mission-summary/MissionSummaryContent";

type Props = {
  conversationId: string;
};

export default function LearningSummaryScreen({ conversationId }: Props) {
  const router = useRouter();
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [showIntro, setShowIntro] = useState(!prefersReducedMotion);
  const { data: detail, isLoading, isError } = useGetConversationDetail(conversationId);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  if (isLoading) {
    return <LoadingTips label="Menyusun laporan belajarmu..." />;
  }

  if (isError || !detail) {
    return (
      <Stack spacing={2} sx={{ py: 4, textAlign: "center" }}>
        <Typography color="error">Gagal memuat ringkasan sesi.</Typography>
        <Button variant="outlined" onClick={() => router.push("/dashboard")}>
          Kembali ke Dashboard
        </Button>
      </Stack>
    );
  }

  const summary = detail.summary as SessionSummaryFeedback | null;
  const metrics = detail.metrics as SessionMetrics | null;
  const sessionGoals = (detail.sessionGoals ?? []) as SessionGoal[];

  if (!summary || !metrics) {
    return (
      <Stack spacing={2} sx={{ py: 4, textAlign: "center" }}>
        <Typography>Ringkasan belum tersedia untuk sesi ini.</Typography>
        <Button variant="outlined" onClick={() => router.push("/dashboard")}>
          Kembali ke Dashboard
        </Button>
      </Stack>
    );
  }

  const tutorName = getTutorName(detail.characterId);
  const tutorEmoji = CHARACTER_EMOJIS[detail.characterId] ?? "🎓";
  const tutorMessage = buildTutorCongrats(tutorName, detail.scenarioLabel, summary);

  return (
    <>
      {showIntro && (
        <MissionCompleteIntro
          scenarioLabel={detail.scenarioLabel}
          tutorName={tutorName}
          tutorEmoji={tutorEmoji}
          goals={sessionGoals}
          tutorMessage={tutorMessage}
          onComplete={handleIntroComplete}
        />
      )}

      {!showIntro && (
        <MissionSummaryContent
          detail={detail}
          summary={summary}
          metrics={metrics}
          sessionGoals={sessionGoals}
        />
      )}
    </>
  );
}
