"use client";

import Typography from "@mui/material/Typography";

type Props = {
  scenarioLabel: string;
};

export default function ObjectiveCardCompact({ scenarioLabel }: Props) {
  return (
    <Typography
      variant="caption"
      sx={{
        color: "text.secondary",
        fontWeight: 600,
        textAlign: "left",
      }}
    >
      🎯 {scenarioLabel} Practice
    </Typography>
  );
}
