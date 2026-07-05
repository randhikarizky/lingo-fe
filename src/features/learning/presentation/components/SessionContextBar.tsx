"use client";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  getPersonality,
  type PersonalityId,
} from "@/features/conversation/domain/constants/personalities";
import {
  CHARACTER_EMOJIS,
  formatDifficultyLabel,
  getTutorName,
} from "../../domain/constants/characters";

function resolvePersonalityId(value: string): PersonalityId {
  if (
    value === "santai" ||
    value === "semangat" ||
    value === "teliti" ||
    value === "bebas"
  ) {
    return value;
  }

  return "santai";
}

type Props = {
  characterId: string;
  personality: string;
  scenarioLabel: string;
  difficulty: string;
};

export default function SessionContextBar({
  characterId,
  personality,
  scenarioLabel,
  difficulty,
}: Props) {
  const personalityConfig = getPersonality(resolvePersonalityId(personality));

  return (
    <Stack spacing={0.75}>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 0.75 }}>
        <Chip
          size="small"
          variant="soft"
          label={`${CHARACTER_EMOJIS[characterId] ?? "🎓"} ${getTutorName(characterId)} · ${personalityConfig.label}`}
        />
        <Chip size="small" variant="outlined" label={scenarioLabel} />
        <Chip size="small" variant="outlined" label={formatDifficultyLabel(difficulty)} />
      </Stack>
      <Typography variant="caption" color="text.secondary">
        Tutor & skenario dikunci selama sesi latihan ini.
      </Typography>
    </Stack>
  );
}
