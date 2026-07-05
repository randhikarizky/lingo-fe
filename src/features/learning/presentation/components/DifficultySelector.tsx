"use client";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { M3_MOTION_EASE } from "@/theme/animate/m3-page";
import type { DifficultyId } from "../../domain/entities/learning-session.entity";
import DifficultyCard from "./mission-briefing/DifficultyCard";

type DifficultyOption = {
  id: DifficultyId;
  label: string;
};

type Props = {
  options: DifficultyOption[];
  value: DifficultyId;
  onChange: (value: DifficultyId) => void;
  disabled?: boolean;
};

export default function DifficultySelector({
  options,
  value,
  onChange,
  disabled,
}: Props) {
  return (
    <Stack spacing={1}>
      {options.map((option, index) => (
        <Box
          key={option.id}
          component={m.div}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.05,
            duration: 0.32,
            ease: M3_MOTION_EASE.decelerate,
          }}
        >
          <DifficultyCard
            difficulty={option.id}
            label={option.label}
            selected={value === option.id}
            disabled={disabled}
            onSelect={() => onChange(option.id)}
          />
        </Box>
      ))}
    </Stack>
  );
}
