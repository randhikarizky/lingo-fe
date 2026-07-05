"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { PRICING_SECTION_SPACING } from "./pricing.tokens";

export default function PricingHero() {
  return (
    <Box sx={{ pt: 1, pb: PRICING_SECTION_SPACING - 1 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 900,
          letterSpacing: -0.5,
          lineHeight: 1.15,
          mb: 1.25,
        }}
      >
        Buka Potensi
        <br />
        Speaking Penuhmu
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ fontWeight: 600, lineHeight: 1.55, maxWidth: 340 }}
      >
        Latihan setiap hari dengan tutor AI yang menyesuaikan levelmu.
      </Typography>
    </Box>
  );
}
