"use client";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import type { ProgressSummary } from "@/features/dashboard/data/network/progress.api";
import AnimatedNumber from "../AnimatedNumber";
import { estimateVocabulary } from "../../utils/dashboard.utils";
import { alpha } from "@mui/material/styles";
import { DASHBOARD_HERO, DASHBOARD_RADIUS } from "./dashboard.tokens";

type Props = {
  summary: ProgressSummary;
};

const METRICS = [
  {
    key: "streak",
    icon: "🔥",
    label: "Streak Harian",
    getValue: (s: ProgressSummary) => s.currentStreak,
  },
  {
    key: "sessions",
    icon: "⭐",
    label: "Sesi",
    getValue: (s: ProgressSummary) => s.conversationCount,
  },
  {
    key: "speaking",
    icon: "🎙",
    label: "Menit Speaking",
    getValue: (s: ProgressSummary) => s.speakingMinutes,
  },
  {
    key: "vocab",
    icon: "📚",
    label: "Kosakata",
    getValue: (s: ProgressSummary) => estimateVocabulary(s),
  },
] as const;

export default function DashboardLearningSnapshot({ summary }: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 1.5,
      }}
    >
      {METRICS.map((metric, index) => (
        <Card
          key={metric.key}
          component={m.div}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06, duration: 0.32 }}
          sx={{
            p: 1.75,
            borderRadius: `${DASHBOARD_RADIUS.panel}px`,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            ...(metric.key === "streak" &&
              summary.currentStreak > 0 && {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14),
                border: "1px solid",
                borderColor: alpha(DASHBOARD_HERO.gold, 0.35),
                color: DASHBOARD_HERO.text,
              }),
          }}
        >
          <Box sx={{ fontSize: 28, lineHeight: 1 }}>{metric.icon}</Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                display: "block",
                lineHeight: 1.2,
                color:
                  metric.key === "streak" && summary.currentStreak > 0
                    ? DASHBOARD_HERO.textMuted
                    : "text.secondary",
              }}
            >
              {metric.label}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
              <AnimatedNumber value={metric.getValue(summary)} />
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
