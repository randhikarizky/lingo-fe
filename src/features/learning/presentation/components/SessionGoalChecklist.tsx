"use client";

import { m } from "framer-motion";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AnimatedNumber from "@/features/dashboard/presentation/components/AnimatedNumber";
import GoalProgressPulse from "./GoalProgressPulse";
import { M3_MOTION_EASE } from "@/theme/animate/m3-page";
import type { SessionGoal } from "../../domain/entities/learning-session.entity";
import { SxProps, Theme } from "@mui/material";

type Props = {
  goals: SessionGoal[];
  title?: string;
  compact?: boolean;
  pulseKey?: number;
  recentlyAchievedIds?: string[];
  sx?: SxProps<Theme>;
};

export default function SessionGoalChecklist({
  goals,
  title = "Misi Sesi",
  compact = false,
  pulseKey = 0,
  recentlyAchievedIds = [],
  ...props
}: Props) {
  const achievedCount = goals.filter((goal) => goal.achieved).length;
  const highlightSet = new Set(recentlyAchievedIds);

  return (
    <Card sx={{ ...props.sx, p: compact ? 1.5 : 2, px: 0 }}>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <GoalProgressPulse pulseKey={pulseKey}>
          <Typography variant="caption" color="text.secondary" component="span">
            <AnimatedNumber value={achievedCount} />/{goals.length} tercapai
          </Typography>
        </GoalProgressPulse>
      </Stack>

      <Stack spacing={compact ? 0.75 : 1}>
        {goals.map((goal) => {
          const isHighlighted = highlightSet.has(goal.id);

          return (
            <Stack
              key={goal.id}
              component={m.div}
              layout
              initial={false}
              animate={
                isHighlighted
                  ? {
                      scale: [1, 1.03, 1],
                      backgroundColor: [
                        "transparent",
                        "rgba(76, 175, 80, 0.12)",
                        "transparent",
                      ],
                    }
                  : { scale: 1 }
              }
              transition={{ duration: 0.55, ease: M3_MOTION_EASE.expressive }}
              direction="row"
              spacing={1}
              sx={{
                alignItems: "flex-start",
                opacity: goal.achieved ? 1 : 0.92,
                borderRadius: 2,
                px: 0.5,
                mx: -0.5,
              }}
            >
              <Box
                component={m.div}
                animate={
                  goal.achieved && isHighlighted
                    ? { scale: [0.6, 1.2, 1], rotate: [0, -8, 0] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.45, ease: M3_MOTION_EASE.expressive }}
                sx={{ pt: 0.15, color: goal.achieved ? "success.main" : "text.disabled" }}
              >
                {goal.achieved ? (
                  <CheckCircleRoundedIcon fontSize="small" />
                ) : (
                  <RadioButtonUncheckedRoundedIcon fontSize="small" />
                )}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: goal.achieved ? 700 : 500,
                    textDecoration: goal.achieved ? "line-through" : "none",
                    color: goal.achieved ? "text.secondary" : "text.primary",
                  }}
                >
                  {goal.emoji} {goal.label}
                </Typography>
                {goal.progressLabel && (
                  <Typography variant="caption" color="text.secondary">
                    {goal.progressLabel}
                  </Typography>
                )}
              </Box>
            </Stack>
          );
        })}
      </Stack>
    </Card>
  );
}
