"use client";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type Props = {
  savingsPercent?: number;
  savingsLabel?: string;
  accent?: string;
};

export default function SavingsBadge({
  savingsPercent = 58,
  savingsLabel = "Dibanding langganan tahunan.",
  accent = "#34D399",
}: Props) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}
    >
      <Chip
        label={`Hemat ${savingsPercent}%`}
        size="small"
        sx={{
          bgcolor: accent,
          color: "#052e1a",
          fontWeight: 900,
          letterSpacing: 0.4,
        }}
      />
      <Typography
        variant="caption"
        sx={{ color: "inherit", opacity: 0.75, fontWeight: 600 }}
      >
        {savingsLabel}
      </Typography>
    </Stack>
  );
}
