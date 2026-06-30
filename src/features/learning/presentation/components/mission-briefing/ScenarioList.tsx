"use client";

import { AnimatePresence, m } from "framer-motion";
import Box from "@mui/material/Box";

import { M3_MOTION_EASE } from "@/theme/animate/m3-page";
import type { ScenarioDefinition } from "../../../domain/entities/learning-session.entity";
import type { DifficultyId } from "../../../domain/entities/learning-session.entity";
import ScenarioCard from "./ScenarioCard";
import { getEstimatedDuration } from "./mission-briefing.tokens";

type Props = {
  scenarios: ScenarioDefinition[];
  category: string;
  value: string;
  difficulty: DifficultyId;
  disabled?: boolean;
  isLocked?: (scenarioId: string) => boolean;
  onChange: (scenarioId: string) => void;
  onLockedClick: (scenario: ScenarioDefinition) => void;
};

export default function ScenarioList({
  scenarios,
  category,
  value,
  difficulty,
  disabled,
  isLocked,
  onChange,
  onLockedClick,
}: Props) {
  return (
    <AnimatePresence mode="wait">
      <Box
        key={category}
        component={m.div}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28, ease: M3_MOTION_EASE.decelerate }}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          gap: 1,
        }}
      >
        {scenarios.map((scenario, index) => {
          const locked = isLocked?.(scenario.id) ?? false;

          return (
            <Box
              key={scenario.id}
              component={m.div}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04, duration: 0.28 }}
            >
              <ScenarioCard
                scenario={scenario}
                selected={value === scenario.id}
                locked={locked}
                disabled={disabled}
                estimatedDuration={getEstimatedDuration(difficulty)}
                onSelect={() => onChange(scenario.id)}
                onLockedClick={() => onLockedClick(scenario)}
              />
            </Box>
          );
        })}
      </Box>
    </AnimatePresence>
  );
}
