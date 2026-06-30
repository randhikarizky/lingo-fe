"use client";

import { m } from "framer-motion";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

import type { ScenarioDefinition } from "../../../domain/entities/learning-session.entity";
import { BRIEFING_RADIUS, briefingSectionSx, getScenarioIcon } from "./mission-briefing.tokens";

type Props = {
  scenario: ScenarioDefinition;
  selected: boolean;
  locked: boolean;
  estimatedDuration: string;
  disabled?: boolean;
  onSelect: () => void;
  onLockedClick: () => void;
};

export default function ScenarioCard({
  scenario,
  selected,
  locked,
  estimatedDuration,
  disabled,
  onSelect,
  onLockedClick,
}: Props) {
  return (
    <Card
      component={m.button}
      type="button"
      disabled={disabled}
      onClick={() => {
        if (locked) {
          onLockedClick();
          return;
        }
        onSelect();
      }}
      whileTap={disabled || locked ? undefined : { scale: 0.97 }}
      sx={{
        ...briefingSectionSx,
        p: 1.25,
        width: "100%",
        textAlign: "left",
        cursor: disabled ? "default" : "pointer",
        border: "2px solid",
        borderColor: selected ? "primary.main" : "divider",
        bgcolor: selected ? alpha("#FA7D19", 0.12) : "background.paper",
        color: locked ? "text.disabled" : "text.primary",
        opacity: locked ? 0.55 : 1,
        transition: "border-color 0.2s, background-color 0.2s",
      }}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: "flex-start" }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: `${BRIEFING_RADIUS.item}px`,
            display: "grid",
            placeItems: "center",
            fontSize: 20,
            bgcolor: "background.surfaceContainerHigh",
            flexShrink: 0,
          }}
        >
          {locked ? <LockRoundedIcon fontSize="small" /> : getScenarioIcon(scenario.id)}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }} noWrap>
              {scenario.label}
            </Typography>
            {locked && (
              <Chip
                label="Butuh Pro"
                size="small"
                color="warning"
                variant="soft"
                sx={{ height: 22, fontSize: 10, fontWeight: 800, borderRadius: `${BRIEFING_RADIUS.inset}px` }}
              />
            )}
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            {scenario.category}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, lineHeight: 1.35 }}>
            {scenario.objective}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", fontWeight: 700 }}>
            Est. {estimatedDuration}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
