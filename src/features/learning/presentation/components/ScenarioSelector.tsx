"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { ScenarioDefinition } from "../../domain/entities/learning-session.entity";

type Props = {
  groups: Array<{
    category: string;
    scenarios: ScenarioDefinition[];
  }>;
  value: string;
  onChange: (scenarioId: string) => void;
  disabled?: boolean;
  isLocked?: (scenarioId: string) => boolean;
  onLockedClick?: (scenario: ScenarioDefinition) => void;
};

export default function ScenarioSelector({
  groups,
  value,
  onChange,
  disabled,
  isLocked,
  onLockedClick,
}: Props) {
  return (
    <Stack spacing={2}>
      {groups.map((group) => (
        <Box key={group.category}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: "block" }}>
            {group.category}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {group.scenarios.map((scenario) => {
              const locked = isLocked?.(scenario.id) ?? false;

              return (
                <Chip
                  key={scenario.id}
                  label={locked ? `🔒 ${scenario.label}` : scenario.label}
                  clickable
                  disabled={disabled}
                  color={value === scenario.id ? "primary" : "default"}
                  variant={value === scenario.id ? "filled" : "outlined"}
                  onClick={() => {
                    if (locked) {
                      onLockedClick?.(scenario);
                      return;
                    }

                    onChange(scenario.id);
                  }}
                />
              );
            })}
          </Box>
        </Box>
      ))}
    </Stack>
  );
}
