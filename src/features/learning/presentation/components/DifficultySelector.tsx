"use client";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { DifficultyId } from "../../domain/entities/learning-session.entity";

type DifficultyOption = {
  id: DifficultyId;
  label: string;
};

const DIFFICULTY_HINTS: Record<DifficultyId, string> = {
  beginner: "Kalimat pendek & kosakata sederhana",
  intermediate: "Percakapan natural dengan variasi grammar",
  advanced: "Respons kaya, idiom, dan nuansa grammar",
};

type Props = {
  options: DifficultyOption[];
  value: DifficultyId;
  onChange: (value: DifficultyId) => void;
  disabled?: boolean;
};

export default function DifficultySelector({ options, value, onChange, disabled }: Props) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
        {options.map((option) => (
          <Chip
            key={option.id}
            label={option.label}
            clickable
            disabled={disabled}
            color={value === option.id ? "secondary" : "default"}
            variant={value === option.id ? "filled" : "outlined"}
            onClick={() => onChange(option.id)}
          />
        ))}
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {DIFFICULTY_HINTS[value]}
      </Typography>
    </Stack>
  );
}
