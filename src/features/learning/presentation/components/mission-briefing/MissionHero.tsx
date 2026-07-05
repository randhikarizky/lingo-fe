"use client";

import { AnimatePresence, m } from "framer-motion";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { M3_MOTION_EASE } from "@/theme/animate/m3-page";
import type {
  DifficultyId,
  ScenarioDefinition,
} from "../../../domain/entities/learning-session.entity";
import {
  BRIEFING_HERO,
  BRIEFING_RADIUS,
  briefingSectionSx,
  getEstimatedDuration,
  getScenarioIcon,
} from "./mission-briefing.tokens";

type Props = {
  scenario: ScenarioDefinition;
  difficulty: DifficultyId;
  difficultyLabel: string;
  tutorName: string;
  tutorEmoji: string;
};

export default function MissionHero({
  scenario,
  difficulty,
  difficultyLabel,
  tutorName,
  tutorEmoji,
}: Props) {
  const previewKey = `${scenario.id}-${difficulty}-${tutorName}`;

  return (
    <AnimatePresence mode="wait">
      <Card
        key={previewKey}
        component={m.div}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.32, ease: M3_MOTION_EASE.decelerate }}
        sx={{
          ...briefingSectionSx,
          p: { xs: 2.5, sm: 3 },
          color: BRIEFING_HERO.text,
          bgcolor: "#12102a",
          backgroundImage: BRIEFING_HERO.bg,
          border: BRIEFING_HERO.border,
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: `${BRIEFING_RADIUS.panel}px`,
                display: "grid",
                placeItems: "center",
                fontSize: 26,
                bgcolor: "rgba(255,255,255,0.08)",
              }}
            >
              {getScenarioIcon(scenario.id)}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="overline"
                sx={{ color: BRIEFING_HERO.gold, fontWeight: 800 }}
              >
                {scenario.category} · Pratinjau Sesi
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
                {scenario.label}
              </Typography>
              <Stack
                direction="row"
                spacing={0.75}
                sx={{ mt: 1, flexWrap: "wrap", gap: 0.75 }}
              >
                <Chip
                  size="small"
                  label={difficultyLabel}
                  sx={{
                    bgcolor: "rgba(245,185,66,0.15)",
                    color: BRIEFING_HERO.gold,
                    fontWeight: 800,
                    borderRadius: `${BRIEFING_RADIUS.inset}px`,
                  }}
                />
                <Chip
                  size="small"
                  label={`${tutorEmoji} ${tutorName}`}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.08)",
                    color: BRIEFING_HERO.text,
                    fontWeight: 700,
                    borderRadius: `${BRIEFING_RADIUS.inset}px`,
                  }}
                />
              </Stack>
            </Box>
          </Stack>

          <Typography
            variant="h6"
            sx={{ fontWeight: 700, lineHeight: 1.35, color: "rgba(255,255,255,0.92)" }}
          >
            {scenario.objective}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
            }}
          >
            {[
              { label: "Skenario", value: scenario.label },
              { label: "Durasi", value: getEstimatedDuration(difficulty) },
              { label: "Tutor", value: `${tutorEmoji} ${tutorName}` },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  p: 1.1,
                  borderRadius: `${BRIEFING_RADIUS.item}px`,
                  bgcolor: "rgba(255,255,255,0.05)",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: BRIEFING_HERO.textMuted, display: "block" }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    color: BRIEFING_HERO.text,
                    display: "block",
                    mt: 0.25,
                  }}
                  noWrap
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Stack>
      </Card>
    </AnimatePresence>
  );
}
