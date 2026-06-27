"use client";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type Props = {
  scenarioLabel: string;
  scenarioCategory: string;
  difficultyLabel: string;
  objective: string;
  characterName: string;
};

export default function ObjectiveCard({
  scenarioLabel,
  scenarioCategory,
  difficultyLabel,
  objective,
  characterName,
}: Props) {
  return (
    <Card
      sx={{
        p: 2,
        bgcolor: "primary.tonalContainer",
        color: "primary.onTonalContainer",
      }}
    >
      <Stack spacing={1}>
        <Typography variant="overline" sx={{ opacity: 0.8 }}>
          Tujuan Sesi
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
          {objective}
        </Typography>
        <Typography variant="body2">
          {scenarioCategory} · {scenarioLabel} · {difficultyLabel} · dengan {characterName}
        </Typography>
      </Stack>
    </Card>
  );
}
