"use client";

import { m } from "framer-motion";
import Box from "@mui/material/Box";

import { M3_MOTION_EASE } from "@/theme/animate/m3-page";

type Props = {
  pulseKey: number;
  children: React.ReactNode;
};

export default function GoalProgressPulse({ pulseKey, children }: Props) {
  return (
    <Box
      component={m.span}
      key={pulseKey}
      initial={{ scale: 1 }}
      animate={
        pulseKey > 0
          ? {
              scale: [1, 1.18, 1],
              color: ["inherit", "var(--mui-palette-success-main)", "inherit"],
            }
          : { scale: 1 }
      }
      transition={{ duration: 0.55, ease: M3_MOTION_EASE.expressive }}
      sx={{ display: "inline-flex", alignItems: "center" }}
    >
      {children}
    </Box>
  );
}
