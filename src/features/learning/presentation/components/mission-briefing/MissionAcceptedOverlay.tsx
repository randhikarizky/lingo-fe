"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { M3_MOTION_EASE } from "@/theme/animate/m3-page";
import { BRIEFING_HERO } from "./mission-briefing.tokens";

type Props = {
  scenarioLabel: string;
  tutorName: string;
  tutorEmoji: string;
  onComplete: () => void;
};

export default function MissionAcceptedOverlay({
  scenarioLabel,
  tutorName,
  tutorEmoji,
  onComplete,
}: Props) {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const timers: number[] = [];

    timers.push(window.setTimeout(() => setCountdown(3), 700));
    timers.push(window.setTimeout(() => setCountdown(2), 1050));
    timers.push(window.setTimeout(() => setCountdown(1), 1400));
    timers.push(window.setTimeout(() => onComplete(), 1750));

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [onComplete]);

  return (
    <Box
      component={m.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1400,
        display: "grid",
        placeItems: "center",
        bgcolor: "#0b0918",
        backgroundImage:
          "radial-gradient(circle at 50% 20%, rgba(245,185,66,0.2), transparent 45%), radial-gradient(circle at 80% 80%, rgba(108,92,231,0.18), transparent 40%)",
      }}
    >
      <Stack spacing={2} sx={{ textAlign: "center", px: 3, maxWidth: 360 }}>
        <Typography
          component={m.p}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: M3_MOTION_EASE.expressive }}
          variant="overline"
          sx={{ color: BRIEFING_HERO.gold, letterSpacing: 3, fontWeight: 900 }}
        >
          MISI DITERIMA
        </Typography>

        <Box
          component={m.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.35 }}
        >
          <Typography variant="h4" sx={{ color: BRIEFING_HERO.text, fontWeight: 900 }}>
            {scenarioLabel}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: BRIEFING_HERO.textMuted, mt: 0.5 }}>
            {tutorEmoji} dengan {tutorName}
          </Typography>
        </Box>

        <AnimatePresence mode="wait">
          {countdown !== null && (
            <Typography
              key={countdown}
              component={m.span}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.22, ease: M3_MOTION_EASE.decelerate }}
              variant="h2"
              sx={{ color: BRIEFING_HERO.gold, fontWeight: 900, lineHeight: 1 }}
            >
              {countdown}
            </Typography>
          )}
        </AnimatePresence>
      </Stack>
    </Box>
  );
}
