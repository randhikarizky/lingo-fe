"use client";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

import AnimatedNumber from "@/features/dashboard/presentation/components/AnimatedNumber";
import type { ProgressSummary } from "@/features/dashboard/data/network/progress.api";
import { profileSectionCardSx, PROFILE_RADIUS } from "./profile.tokens";

type Props = {
  summary: ProgressSummary | undefined;
  isLoading: boolean;
};

function estimateVocabularyLearned(summary: ProgressSummary) {
  return Math.max(summary.conversationCount * 4, Math.round(summary.messageCount * 0.6));
}

const STATS = [
  {
    key: "streak",
    emoji: "🔥",
    label: "Streak Harian",
    getValue: (s: ProgressSummary) => s.currentStreak,
  },
  {
    key: "sessions",
    emoji: "⭐",
    label: "Sesi",
    getValue: (s: ProgressSummary) => s.conversationCount,
  },
  {
    key: "speaking",
    emoji: "🎙",
    label: "Menit Speaking",
    getValue: (s: ProgressSummary) => s.speakingMinutes,
  },
  {
    key: "vocab",
    emoji: "📚",
    label: "Kosakata",
    getValue: (s: ProgressSummary) => estimateVocabularyLearned(s),
  },
] as const;

export default function LearningSnapshot({ summary, isLoading }: Props) {
  return (
    <Card sx={{ ...profileSectionCardSx, p: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
        Ringkasan Belajar
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1,
        }}
      >
        {STATS.map((stat, index) => (
          <Box
            key={stat.key}
            component={m.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.35 }}
            sx={{
              p: 1.25,
              borderRadius: `${PROFILE_RADIUS.item}px`,
              bgcolor: "background.surfaceContainerHigh",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="caption" sx={{ display: "block", mb: 0.25 }}>
              {stat.emoji} {stat.label}
            </Typography>
            {isLoading || !summary ? (
              <Skeleton width={48} height={32} />
            ) : (
              <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                <AnimatedNumber value={stat.getValue(summary)} />
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Card>
  );
}
