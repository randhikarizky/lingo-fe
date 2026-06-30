"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { M3_MOTION_EASE } from "@/theme/animate/m3-page";
import type { SessionGoal } from "../../../domain/entities/learning-session.entity";
import { MISSION_RADIUS } from "./mission-summary.tokens";

type Props = {
  scenarioLabel: string;
  tutorName: string;
  tutorEmoji: string;
  goals: SessionGoal[];
  tutorMessage: string;
  onComplete: () => void;
};

export default function MissionCompleteIntro({
  scenarioLabel,
  tutorName,
  tutorEmoji,
  goals,
  tutorMessage,
  onComplete,
}: Props) {
  const [checkedCount, setCheckedCount] = useState(0);
  const [phase, setPhase] = useState<"title" | "objectives" | "tutor" | "exit">("title");

  useEffect(() => {
    const timers: number[] = [];

    timers.push(window.setTimeout(() => setPhase("objectives"), 500));

    goals.forEach((_, index) => {
      timers.push(
        window.setTimeout(() => {
          setCheckedCount(index + 1);
        }, 900 + index * 380)
      );
    });

    const objectivesDone = 900 + goals.length * 380 + 400;
    timers.push(window.setTimeout(() => setPhase("tutor"), objectivesDone));
    timers.push(window.setTimeout(() => setPhase("exit"), objectivesDone + 900));
    timers.push(window.setTimeout(() => onComplete(), objectivesDone + 1200));

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [goals, onComplete]);

  return (
    <AnimatePresence>
      <Box
        component={m.div}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: M3_MOTION_EASE.decelerate }}
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 1400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#0b0918",
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(245,185,66,0.18), transparent 42%), radial-gradient(circle at 80% 80%, rgba(108,92,231,0.2), transparent 40%)",
        }}
      >
        <Stack spacing={3} sx={{ width: "100%", maxWidth: 420, px: 3, textAlign: "center" }}>
          <Box>
            <Typography
              component={m.p}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: M3_MOTION_EASE.decelerate }}
              variant="overline"
              sx={{ color: "#F5B942", letterSpacing: 3, fontWeight: 800 }}
            >
              MISI SELESAI
            </Typography>
            <Typography
              component={m.h4}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12, duration: 0.5, ease: M3_MOTION_EASE.expressive }}
              sx={{ color: "#fff", fontWeight: 900, mt: 0.5 }}
            >
              Misi {scenarioLabel} Selesai
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ mt: 1, justifyContent: "center" }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Box
                  key={index}
                  component={m.span}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + index * 0.08, duration: 0.35 }}
                  sx={{ color: "#F5B942", fontSize: 20 }}
                >
                  ★
                </Box>
              ))}
            </Stack>
          </Box>

          {(phase === "objectives" || phase === "tutor" || phase === "exit") && goals.length > 0 && (
            <Stack spacing={1} sx={{ textAlign: "left" }}>
              {goals.map((goal, index) => {
                const isChecked = index < checkedCount;
                return (
                  <Stack
                    key={goal.id}
                    component={m.div}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{
                      opacity: isChecked ? 1 : 0.35,
                      x: 0,
                      scale: isChecked ? [1, 1.03, 1] : 1,
                    }}
                    transition={{ duration: 0.35, ease: M3_MOTION_EASE.decelerate }}
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <CheckCircleRoundedIcon
                      sx={{ color: isChecked ? "#6EE7A8" : "rgba(255,255,255,0.25)", fontSize: 20 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: isChecked ? "#fff" : "rgba(255,255,255,0.45)",
                        fontWeight: isChecked ? 700 : 500,
                      }}
                    >
                      {goal.label}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          )}

          {(phase === "tutor" || phase === "exit") && (
            <Box
              component={m.div}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: M3_MOTION_EASE.decelerate }}
              sx={{
                p: 2,
                borderRadius: `${MISSION_RADIUS.panel}px`,
                bgcolor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(245,185,66,0.25)",
                textAlign: "left",
              }}
            >
              <Typography variant="subtitle2" sx={{ color: "#F5B942", fontWeight: 800, mb: 0.5 }}>
                {tutorEmoji} {tutorName}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.88)" }}>
                {tutorMessage}
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </AnimatePresence>
  );
}
