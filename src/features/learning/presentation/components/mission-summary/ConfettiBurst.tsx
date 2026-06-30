"use client";

import { useMemo } from "react";
import { m } from "framer-motion";
import Box from "@mui/material/Box";

const COLORS = ["#F5B942", "#6EE7A8", "#8B7CF6", "#FF8FAB", "#60A5FA"];

export default function ConfettiBurst() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: `${4 + Math.random() * 92}%`,
        delay: Math.random() * 0.35,
        duration: 1.6 + Math.random() * 0.8,
        color: COLORS[index % COLORS.length],
        size: 6 + Math.round(Math.random() * 4),
        rotate: Math.random() * 360,
      })),
    []
  );

  return (
    <Box
      aria-hidden
      sx={{
        pointerEvents: "none",
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      {particles.map((particle) => (
        <Box
          key={particle.id}
          component={m.span}
          initial={{ opacity: 0, y: -20, rotate: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: [0, 120, 260], rotate: particle.rotate }}
          transition={{
            delay: particle.delay,
            duration: particle.duration,
            ease: "easeOut",
          }}
          sx={{
            position: "absolute",
            top: 0,
            left: particle.left,
            width: particle.size,
            height: particle.size * 0.6,
            borderRadius: 0.5,
            bgcolor: particle.color,
          }}
        />
      ))}
    </Box>
  );
}
