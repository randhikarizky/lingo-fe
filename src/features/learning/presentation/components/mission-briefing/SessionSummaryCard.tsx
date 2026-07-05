"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { briefingSectionSx, getSessionDurationMinutes } from "./mission-briefing.tokens";
import type { DifficultyId } from "../../../domain/entities/learning-session.entity";

type Props = {
  tutorName: string;
  scenarioLabel: string;
  difficultyLabel: string;
  difficulty: DifficultyId;
  objectiveCount: number;
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" sx={{ justifyContent: "space-between", py: 0.5 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 800 }}>
        {value}
      </Typography>
    </Stack>
  );
}

export default function SessionSummaryCard({
  tutorName,
  scenarioLabel,
  difficultyLabel,
  difficulty,
  objectiveCount,
}: Props) {
  return (
    <Card sx={{ ...briefingSectionSx, p: 2 }}>
      <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800 }}>
        Sesi Hari Ini
      </Typography>
      <Box sx={{ mt: 1 }}>
        <SummaryRow label="Tutor" value={tutorName} />
        <SummaryRow label="Skenario" value={scenarioLabel} />
        <SummaryRow label="Tingkat" value={difficultyLabel} />
        <SummaryRow
          label="Durasi"
          value={`${getSessionDurationMinutes(difficulty)} Menit`}
        />
        <SummaryRow label="Tujuan" value={String(objectiveCount)} />
      </Box>
    </Card>
  );
}
