"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AnimatedNumber from "@/features/dashboard/presentation/components/AnimatedNumber";
import GoalProgressPulse from "./GoalProgressPulse";

type Props = {
  achieved: number;
  total: number;
  pulseKey?: number;
};

export default function MiniGoalWidget({ achieved, total, pulseKey = 0 }: Props) {
  return (
    <GoalProgressPulse pulseKey={pulseKey}>
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          alignItems: "center",
        }}
      >
        <Typography variant="body2" component="span" sx={{ fontWeight: 700 }}>
          🎯 <AnimatedNumber value={achieved} /> / {total} Tujuan
        </Typography>
      </Stack>
    </GoalProgressPulse>
  );
}
