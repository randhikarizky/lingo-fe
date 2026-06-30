"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import { TRUST_ITEMS } from "../../utils/pricing.utils";
import { PRICING_RADIUS } from "./pricing.tokens";

export default function TrustSection() {
  return (
    <Card sx={{ p: 2.5, borderRadius: `${PRICING_RADIUS.section}px` }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
        Mengapa pelajar memilih Lingora
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 1.25,
        }}
      >
        {TRUST_ITEMS.map((item) => (
          <Stack key={item} direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <CheckRoundedIcon sx={{ fontSize: 18, color: "success.main", flexShrink: 0 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {item}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Card>
  );
}
