"use client";

import { m } from "framer-motion";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { M3_MOTION_EASE } from "@/theme/animate/m3-page";
import { getAvatarColor } from "@/features/settings/presentation/utils/profile-avatar.utils";
import {
  BRIEFING_RADIUS,
  briefingSectionSx,
  getTutorGreeting,
} from "./mission-briefing.tokens";

type Props = {
  tutorName: string;
  tutorEmoji: string;
  personalityLabel: string;
  objective: string;
  characterId: string;
};

export default function TutorOverviewCard({
  tutorName,
  tutorEmoji,
  personalityLabel,
  objective,
  characterId,
}: Props) {
  const greeting = getTutorGreeting(characterId, objective);

  return (
    <Card
      component={m.div}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: M3_MOTION_EASE.decelerate, delay: 0.06 }}
      sx={{ ...briefingSectionSx, p: 2 }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: getAvatarColor(characterId),
            fontSize: 22,
          }}
        >
          {tutorEmoji}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
            {tutorName}
          </Typography>
          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 800 }}>
            {personalityLabel} · Pelatih
          </Typography>
        </Box>
      </Stack>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 1.25,
          p: 1.25,
          borderRadius: `${BRIEFING_RADIUS.item}px`,
          bgcolor: "background.surfaceContainerHigh",
          fontStyle: "italic",
        }}
      >
        &ldquo;{greeting}&rdquo;
      </Typography>
    </Card>
  );
}
