"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

type Props = {
  items: readonly string[];
  accent?: string;
  dense?: boolean;
};

export default function FeatureChecklist({ items, accent, dense }: Props) {
  return (
    <Stack spacing={dense ? 0.5 : 0.85}>
      {items.map((item) => (
        <Stack key={item} direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
          <CheckRoundedIcon
            sx={{
              fontSize: dense ? 17 : 19,
              color: accent ?? "success.main",
              mt: 0.1,
              flexShrink: 0,
            }}
          />
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.45 }}>
            {item}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
