"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { PERSONALITIES, type PersonalityId } from "../../domain/constants/personalities";

type Props = {
  value: PersonalityId;
  onChange: (id: PersonalityId) => void;
  disabled?: boolean;
};

export default function PersonalityPicker({ value, onChange, disabled = false }: Props) {
  const selected = PERSONALITIES.find((p) => p.id === value);

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Gaya teman ngobrol
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          overflowX: "auto",
          pb: 0.5,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {PERSONALITIES.map((personality) => {
          const isActive = personality.id === value;

          return (
            <Chip
              key={personality.id}
              label={`${personality.emoji} ${personality.label}`}
              onClick={() => !disabled && onChange(personality.id)}
              disabled={disabled}
              variant={isActive ? "filled" : "soft"}
              color={isActive ? "primary" : "default"}
              sx={{
                flexShrink: 0,
                height: 40,
                fontWeight: isActive ? 800 : 600,
                px: 0.5,
              }}
            />
          );
        })}
      </Stack>
      {selected && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          {selected.description}
        </Typography>
      )}
    </Box>
  );
}
