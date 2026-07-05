"use client";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { M3_MOTION_EASE } from "@/theme/animate/m3-page";

export default function LoginBrandHeader() {
  return (
    <Box
      component={m.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: M3_MOTION_EASE.decelerate }}
      sx={{ textAlign: "center" }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: 900, color: "primary.main", letterSpacing: -0.5 }}
      >
        Lingora
      </Typography>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 0.5 }}>
        Berbicara dengan percaya diri.
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
        Didukung AI.
      </Typography>
    </Box>
  );
}
