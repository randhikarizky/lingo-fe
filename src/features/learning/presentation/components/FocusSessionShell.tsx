"use client";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { M3_MOTION_EASE } from "@/theme/animate/m3-page";

export default function FocusSessionShell() {
  return (
    <Box
      sx={{
        mx: -2,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      <Box
        component={m.div}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: M3_MOTION_EASE.decelerate }}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}
      >
        <Box
          component={m.div}
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: "primary.main",
          }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Memasuki sesi latihan...
        </Typography>
      </Box>
    </Box>
  );
}
