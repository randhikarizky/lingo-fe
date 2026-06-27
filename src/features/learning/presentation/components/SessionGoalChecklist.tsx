"use client";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { SessionGoal } from "../../domain/entities/learning-session.entity";

type Props = {
  goals: SessionGoal[];
  title?: string;
  compact?: boolean;
};

export default function SessionGoalChecklist({
  goals,
  title = "Misi Sesi",
  compact = false,
}: Props) {
  const achievedCount = goals.filter((goal) => goal.achieved).length;

  return (
    <Card sx={{ p: compact ? 1.5 : 2 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {achievedCount}/{goals.length} tercapai
        </Typography>
      </Stack>

      <Stack spacing={compact ? 0.75 : 1}>
        {goals.map((goal) => (
          <Stack
            key={goal.id}
            direction="row"
            spacing={1}
            sx={{
              alignItems: "flex-start",
              opacity: goal.achieved ? 1 : 0.92,
            }}
          >
            <Box sx={{ pt: 0.15, color: goal.achieved ? "success.main" : "text.disabled" }}>
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
        ))}
      </Stack>
    </Card>
  );
}
