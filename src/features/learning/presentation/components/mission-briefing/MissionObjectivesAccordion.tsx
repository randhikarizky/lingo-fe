"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import { M3_MOTION_EASE } from "@/theme/animate/m3-page";
import type { SessionGoal } from "../../../domain/entities/learning-session.entity";
import { BRIEFING_RADIUS, briefingSectionSx } from "./mission-briefing.tokens";

type Props = {
  goals: SessionGoal[];
  disabled?: boolean;
};

export default function MissionObjectivesAccordion({ goals, disabled }: Props) {
  const [open, setOpen] = useState(false);

  if (goals.length === 0) return null;

  return (
    <Card sx={{ ...briefingSectionSx, p: 0 }}>
      <Box
        component="button"
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          border: "none",
          bgcolor: "transparent",
          cursor: disabled ? "default" : "pointer",
          textAlign: "left",
          color: "inherit",
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            Tujuan Misi
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {goals.length} Tujuan · 0% progres
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          <IconButton
            size="small"
            aria-label={open ? "Tutup tujuan misi" : "Buka tujuan misi"}
            sx={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.25s ease",
            }}
          >
            <KeyboardArrowDownRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      <Collapse in={open}>
        <Stack spacing={0.75} sx={{ px: 2, pb: 2 }}>
          <AnimatePresence>
            {goals.map((goal, index) => (
              <Stack
                key={goal.id}
                component={m.div}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.28, ease: M3_MOTION_EASE.decelerate }}
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  p: 1,
                  borderRadius: `${BRIEFING_RADIUS.inset}px`,
                  bgcolor: "background.surfaceContainerHigh",
                }}
              >
                <CheckCircleOutlineRoundedIcon sx={{ fontSize: 18, color: "action.disabled" }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {goal.emoji} {goal.label}
                </Typography>
              </Stack>
            ))}
          </AnimatePresence>
        </Stack>
      </Collapse>
    </Card>
  );
}
