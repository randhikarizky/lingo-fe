"use client";

import { m, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SignalWifiOffRoundedIcon from "@mui/icons-material/SignalWifiOffRounded";

import { M3_MOTION_EASE } from "@/theme/animate/m3-page";

type Props = {
  open: boolean;
};

export default function ConnectionBanner({ open }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <Box
          component={m.div}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: M3_MOTION_EASE.decelerate }}
          sx={{
            mx: 2,
            mb: 1,
            px: 1.5,
            py: 0.75,
            borderRadius: 2,
            bgcolor: "warning.tonalContainer",
            color: "warning.onTonalContainer",
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexShrink: 0,
          }}
        >
          <SignalWifiOffRoundedIcon sx={{ fontSize: 18 }} />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Koneksi ke server sedang bermasalah.
          </Typography>
        </Box>
      )}
    </AnimatePresence>
  );
}
