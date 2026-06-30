"use client";

import { m } from "framer-motion";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { DifficultyId } from "../../../domain/entities/learning-session.entity";
import { BRIEFING_RADIUS, briefingSectionSx, DIFFICULTY_BRIEFS } from "./mission-briefing.tokens";

type Props = {
  difficulty: DifficultyId;
  label: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
};

export default function DifficultyCard({
  difficulty,
  label,
  selected,
  disabled,
  onSelect,
}: Props) {
  const brief = DIFFICULTY_BRIEFS[difficulty];

  return (
    <Card
      component={m.button}
      type="button"
      disabled={disabled}
      onClick={onSelect}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      sx={{
        ...briefingSectionSx,
        p: 1.5,
        width: "100%",
        textAlign: "left",
        cursor: disabled ? "default" : "pointer",
        border: "2px solid",
        borderColor: selected ? "secondary.main" : "divider",
        bgcolor: selected ? alpha("#4785FF", 0.12) : "background.paper",
        transition: "border-color 0.2s, background-color 0.2s",
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
        {label}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
        {brief.complexity}
      </Typography>
      <Stack spacing={0.25} sx={{ mt: 0.75 }}>
        {brief.lines.map((line) => (
          <Typography key={line} variant="caption" color="text.secondary">
            · {line}
          </Typography>
        ))}
      </Stack>
    </Card>
  );
}
