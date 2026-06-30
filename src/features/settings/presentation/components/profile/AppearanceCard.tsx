"use client";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import SettingsBrightnessRoundedIcon from "@mui/icons-material/SettingsBrightnessRounded";

import { useSettingsContext } from "@/theme/settings";
import type { ThemeMode } from "@/theme/settings/types";
import { profileSectionCardSx, profileToggleGroupSx } from "./profile.tokens";

export default function AppearanceCard() {
  const settings = useSettingsContext();

  return (
    <Card sx={{ ...profileSectionCardSx, p: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
        Tampilan
      </Typography>

      <Stack spacing={1.25}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
          Tema
        </Typography>
        <ToggleButtonGroup
          exclusive
          fullWidth
          size="small"
          value={settings.themeMode}
          onChange={(_, value: ThemeMode | null) => {
            if (value) settings.onUpdate("themeMode", value);
          }}
          sx={{
            ...profileToggleGroupSx,
            display: "flex",
            "& .MuiToggleButton-root": {
              flex: 1,
              fontWeight: 700,
              gap: 0.5,
            },
          }}
        >
          <ToggleButton value="light">
            <LightModeRoundedIcon sx={{ fontSize: 16 }} />
            Terang
          </ToggleButton>
          <ToggleButton value="dark">
            <DarkModeRoundedIcon sx={{ fontSize: 16 }} />
            Gelap
          </ToggleButton>
          <ToggleButton value="system">
            <SettingsBrightnessRoundedIcon sx={{ fontSize: 16 }} />
            Sistem
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Card>
  );
}
