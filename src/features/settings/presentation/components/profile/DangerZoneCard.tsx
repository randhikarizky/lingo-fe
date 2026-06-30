"use client";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { profileSectionCardSx } from "./profile.tokens";

type Props = {
  onLogout: () => void;
  isLoggingOut: boolean;
};

export default function DangerZoneCard({ onLogout, isLoggingOut }: Props) {
  return (
    <Card
      sx={{
        ...profileSectionCardSx,
        p: 2,
        border: "1px solid",
        borderColor: "error.outline",
        bgcolor: "error.tonalContainer",
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Keluar dari akun di perangkat ini.
      </Typography>
      <Stack spacing={1}>
        <Button
          variant="outlined"
          color="error"
          onClick={onLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Keluar..." : "Keluar"}
        </Button>
      </Stack>
    </Card>
  );
}
