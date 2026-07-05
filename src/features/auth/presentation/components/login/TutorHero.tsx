"use client";

import { useMemo } from "react";
import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { TUTOR_CHARACTERS } from "@/features/learning/domain/constants/characters";
import { LINGORA_HERO, LINGORA_RADIUS } from "@/global/constants/lingora-brand";
import { M3_MOTION_EASE } from "@/theme/animate/m3-page";

const GREETINGS = [
  "Hai!\nAyo latihan Bahasa Inggris bareng.",
  "Siap kapan pun kamu.\nAyo bangun kepercayaan dirimu.",
  "Latihan harianmu\ndimulai di sini.",
  "Berbicara natural.\nAku akan membimbingmu.",
];

function getDailyTutorIndex() {
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.floor(Date.now() / dayMs) % TUTOR_CHARACTERS.length;
}

export default function TutorHero() {
  const tutorIndex = useMemo(() => getDailyTutorIndex(), []);
  const tutor = TUTOR_CHARACTERS[tutorIndex];
  const greeting = GREETINGS[tutorIndex % GREETINGS.length];

  return (
    <Box
      component={m.div}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: M3_MOTION_EASE.decelerate, delay: 0.08 }}
      sx={{
        p: 2,
        borderRadius: `${LINGORA_RADIUS.panel}px`,
        background: LINGORA_HERO.bg,
        border: LINGORA_HERO.border,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            bgcolor: "rgba(255,255,255,0.08)",
            flexShrink: 0,
          }}
        >
          {tutor.emoji}
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{ color: LINGORA_HERO.gold, fontWeight: 800 }}
          >
            {tutor.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: LINGORA_HERO.text,
              fontWeight: 600,
              whiteSpace: "pre-line",
              lineHeight: 1.45,
            }}
          >
            {greeting}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
