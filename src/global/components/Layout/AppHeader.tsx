"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import SettingsDrawer from "@/theme/settings/drawer";

type Props = {
  title: string;
  actions?: React.ReactNode;
};

export default function AppHeader({ title, actions }: Props) {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h4">{title}</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
          <Typography
            component={Link}
            href="/dashboard"
            variant="body2"
            color="primary"
          >
            Dashboard
          </Typography>
          <Typography
            component={Link}
            href="/conversation"
            variant="body2"
            color="primary"
          >
            Conversation
          </Typography>
        </Stack>
      </Box>

      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        {actions}
        <SettingsDrawer />
      </Stack>
    </Stack>
  );
}
