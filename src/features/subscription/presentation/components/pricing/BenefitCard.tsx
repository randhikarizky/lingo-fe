"use client";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { PRICING_RADIUS } from "./pricing.tokens";

type Props = {
  icon: string;
  title: string;
  description: string;
};

export default function BenefitCard({ icon, title, description }: Props) {
  return (
    <Card
      sx={{
        p: 2.5,
        height: "100%",
        borderRadius: `${PRICING_RADIUS.panel}px`,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        transition: "transform 0.22s ease, box-shadow 0.22s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
    >
      <Stack spacing={1.5}>
        <Typography sx={{ fontSize: 36, lineHeight: 1 }}>{icon}</Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
          {description}
        </Typography>
      </Stack>
    </Card>
  );
}
