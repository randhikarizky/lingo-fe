"use client";

import { m } from "framer-motion";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import { BRIEFING_RADIUS, getCategoryIcon } from "./mission-briefing.tokens";

type Props = {
  categories: string[];
  value: string;
  disabled?: boolean;
  onChange: (category: string) => void;
};

export default function ScenarioCategorySelector({
  categories,
  value,
  disabled,
  onChange,
}: Props) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        overflowX: "auto",
        pb: 0.5,
        mx: -0.5,
        px: 0.5,
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {categories.map((category) => {
        const selected = category === value;
        return (
          <Chip
            key={category}
            component={m.button}
            label={`${getCategoryIcon(category)} ${category}`}
            clickable
            disabled={disabled}
            color={selected ? "primary" : "default"}
            variant={selected ? "filled" : "outlined"}
            onClick={() => onChange(category)}
            sx={{
              flexShrink: 0,
              fontWeight: selected ? 800 : 600,
              borderRadius: `${BRIEFING_RADIUS.item}px`,
            }}
          />
        );
      })}
    </Stack>
  );
}
