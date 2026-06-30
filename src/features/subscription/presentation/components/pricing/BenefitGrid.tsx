"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import BenefitCard from "./BenefitCard";
import { WHY_UPGRADE_BENEFITS } from "../../utils/pricing.utils";
import { PRICING_SECTION_SPACING } from "./pricing.tokens";

export default function BenefitGrid() {
  return (
    <Box sx={{ mb: PRICING_SECTION_SPACING }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
        Mengapa Upgrade
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        {WHY_UPGRADE_BENEFITS.map((benefit) => (
          <BenefitCard key={benefit.title} {...benefit} />
        ))}
      </Box>
    </Box>
  );
}
