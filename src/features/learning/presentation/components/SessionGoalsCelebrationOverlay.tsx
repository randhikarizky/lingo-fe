"use client";

import { m, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { M3_MOTION_EASE } from "@/theme/animate/m3-page";
import type { SessionGoal } from "../../domain/entities/learning-session.entity";

const CONFETTI = [
  { x: "12%", delay: 0, color: "#FFB020" },
  { x: "28%", delay: 0.08, color: "#FF6B6B" },
  { x: "44%", delay: 0.04, color: "#4ECDC4" },
  { x: "58%", delay: 0.12, color: "#FFD93D" },
  { x: "72%", delay: 0.06, color: "#6C5CE7" },
  { x: "86%", delay: 0.1, color: "#FF8FAB" },
];

type Props = {
  open: boolean;
  goals: SessionGoal[];
  tutorName: string;
  onContinue: () => void;
  onEndSession: () => void;
};

export default function SessionGoalsCelebrationOverlay({
  open,
  goals,
  tutorName,
  onContinue,
  onEndSession,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <Box
          component={m.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: M3_MOTION_EASE.decelerate }}
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            justifyContent: "center",
            bgcolor: "rgba(8, 12, 20, 0.72)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 480,
              height: "100%",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 2.5,
              overflow: "hidden",
            }}
          >
            {CONFETTI.map((piece, index) => (
              <Box
                key={index}
                component={m.div}
                initial={{ y: -40, opacity: 0, rotate: 0 }}
                animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: 360 }}
                transition={{
                  duration: 2.8,
                  delay: piece.delay,
                  repeat: Infinity,
                  ease: "linear",
                }}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: piece.x,
                  width: 8,
                  height: 14,
                  borderRadius: 1,
                  bgcolor: piece.color,
                }}
              />
            ))}

            <Stack
              component={m.div}
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.45, ease: M3_MOTION_EASE.expressive }}
              spacing={2.5}
              sx={{
                width: "100%",
                p: 3,
                borderRadius: 4,
                bgcolor: "background.paper",
                boxShadow: (theme) => theme.shadows[12],
                textAlign: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Box
                component={m.div}
                animate={{ scale: [1, 1.08, 1], rotate: [0, -6, 6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                sx={{ fontSize: 56, lineHeight: 1 }}
              >
                🎉
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Semua Misi Selesai!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tutorName} bangga — kamu menyelesaikan seluruh tujuan sesi latihan ini.
                </Typography>
              </Box>

              <Stack spacing={1} sx={{ textAlign: "left" }}>
                {goals.map((goal, index) => (
                  <Stack
                    key={goal.id}
                    component={m.div}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.15 + index * 0.08,
                      duration: 0.35,
                      ease: M3_MOTION_EASE.decelerate,
                    }}
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <CheckCircleRoundedIcon sx={{ color: "success.main", fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {goal.emoji} {goal.label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Stack spacing={1.25} sx={{ pt: 0.5 }}>
                <Button variant="contained" size="large" fullWidth onClick={onContinue}>
                  Lanjut Latihan
                </Button>
                <Button variant="outlined" size="large" fullWidth onClick={onEndSession}>
                  Akhiri Sesi
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      )}
    </AnimatePresence>
  );
}
