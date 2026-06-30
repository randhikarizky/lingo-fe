"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { TUTOR_CHARACTERS } from "@/features/learning/domain/constants/characters";
import { useSettingsContext } from "@/theme/settings";
import type {
  DailyGoalMinutes,
  DefaultTutorId,
  PreferredPersonality,
  TargetLanguage,
} from "@/theme/settings/types";
import {
  DAILY_GOAL_OPTIONS,
  getPersonalityLabel,
  getTargetLanguageLabel,
  PERSONALITY_OPTIONS,
  TARGET_LANGUAGES,
} from "../../../domain/constants/learning-preferences";
import OptionPickerSheet from "./OptionPickerSheet";
import { PROFILE_RADIUS, profileSectionCardSx, profileToggleGroupSx } from "./profile.tokens";

function PreferenceRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick?: () => void;
}) {
  return (
    <Box
      component={onClick ? "button" : "div"}
      type={onClick ? "button" : undefined}
      onClick={onClick}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1.25,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: `${PROFILE_RADIUS.item}px`,
        bgcolor: "background.surfaceContainerHigh",
        cursor: onClick ? "pointer" : "default",
        textAlign: "left",
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: 800 }}>
          {value}
        </Typography>
        {onClick && <ChevronRightRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />}
      </Stack>
    </Box>
  );
}

export default function LearningPreferenceCard() {
  const settings = useSettingsContext();
  const [languageSheetOpen, setLanguageSheetOpen] = useState(false);

  return (
    <>
      <Card sx={{ ...profileSectionCardSx, p: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
          Preferensi Belajar
        </Typography>

        <Stack spacing={1.25}>
          <PreferenceRow
            label="Bahasa Target"
            value={getTargetLanguageLabel(settings.targetLanguage)}
            onClick={() => setLanguageSheetOpen(true)}
          />

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mb: 0.75, display: "block" }}>
              Target Harian
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={settings.dailyGoalMinutes}
              onChange={(_, value: DailyGoalMinutes | null) => {
                if (value) settings.onUpdate("dailyGoalMinutes", value);
              }}
              sx={{
                ...profileToggleGroupSx,
                display: "flex",
                "& .MuiToggleButton-root": {
                  flex: 1,
                  fontWeight: 700,
                },
              }}
            >
              {DAILY_GOAL_OPTIONS.map((minutes) => (
                <ToggleButton key={minutes} value={minutes}>
                  {minutes}m
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mb: 0.75, display: "block" }}>
              Tutor Default
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={settings.defaultTutor}
              onChange={(_, value: DefaultTutorId | null) => {
                if (value) settings.onUpdate("defaultTutor", value);
              }}
              sx={{
                ...profileToggleGroupSx,
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
              }}
            >
              {TUTOR_CHARACTERS.map((tutor) => (
                <ToggleButton key={tutor.id} value={tutor.id} sx={{ fontWeight: 700 }}>
                  {tutor.emoji} {tutor.name}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mb: 0.75, display: "block" }}>
              Kepribadian Pilihan
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={settings.preferredPersonality}
              onChange={(_, value: PreferredPersonality | null) => {
                if (value) settings.onUpdate("preferredPersonality", value);
              }}
              sx={{
                ...profileToggleGroupSx,
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
              }}
            >
              {PERSONALITY_OPTIONS.map((option) => (
                <ToggleButton key={option.id} value={option.id} sx={{ fontWeight: 700, fontSize: 12 }}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: "block" }}>
              {getPersonalityLabel(settings.preferredPersonality)} · disimpan untuk sesi berikutnya
            </Typography>
          </Box>
        </Stack>
      </Card>

      <OptionPickerSheet
        open={languageSheetOpen}
        title="Bahasa Target"
        value={settings.targetLanguage}
        options={TARGET_LANGUAGES.map((lang) => ({
          id: lang.id,
          label: lang.label,
          description: lang.nativeLabel,
        }))}
        onClose={() => setLanguageSheetOpen(false)}
        onSelect={(id) => settings.onUpdate("targetLanguage", id as TargetLanguage)}
      />
    </>
  );
}
