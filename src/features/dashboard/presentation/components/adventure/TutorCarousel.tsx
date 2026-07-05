"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

import {
  CHARACTER_TO_PERSONALITY,
  TUTOR_CHARACTERS,
} from "@/features/learning/domain/constants/characters";
import type { UserSubscription } from "@/features/subscription/domain/entities/subscription.entity";
import { isTutorAllowed } from "@/features/subscription/domain/utils/subscription-access";
import { DASHBOARD_RADIUS, dashboardActiveSurface } from "./dashboard.tokens";

type Props = {
  recommendedCharacterId: string;
  scenarioLabel: string;
  subscription?: UserSubscription;
};

function getRecommendationReason(scenarioLabel: string) {
  if (scenarioLabel) {
    return `Direkomendasikan karena kamu sedang latihan percakapan ${scenarioLabel}.`;
  }
  return "Direkomendasikan berdasarkan jalur belajarmu.";
}

export default function TutorCarousel({
  recommendedCharacterId,
  scenarioLabel,
  subscription,
}: Props) {
  const router = useRouter();

  const sorted = [...TUTOR_CHARACTERS].sort((a, b) => {
    if (a.id === recommendedCharacterId) return -1;
    if (b.id === recommendedCharacterId) return 1;
    return 0;
  });

  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        overflowX: "auto",
        pb: 0.5,
        scrollSnapType: "x mandatory",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {sorted.map((tutor) => {
        const locked = subscription ? !isTutorAllowed(subscription, tutor.id) : false;
        const isRecommended = tutor.id === recommendedCharacterId;
        const personality = CHARACTER_TO_PERSONALITY[tutor.id] ?? tutor.personality;

        return (
          <Card
            key={tutor.id}
            sx={(theme) => ({
              minWidth: 260,
              maxWidth: 280,
              flexShrink: 0,
              scrollSnapAlign: "start",
              p: 2,
              borderRadius: `${DASHBOARD_RADIUS.panel}px`,
              ...(isRecommended
                ? dashboardActiveSurface(theme)
                : {
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                  }),
            })}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                <Box sx={{ fontSize: 32 }}>{tutor.emoji}</Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                    {tutor.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    {tutor.role}
                  </Typography>
                </Box>
              </Stack>

              {isRecommended && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.45 }}
                >
                  {getRecommendationReason(scenarioLabel)}
                </Typography>
              )}

              <Button
                variant={isRecommended ? "contained" : "outlined"}
                size="small"
                disabled={locked}
                onClick={() => {
                  if (locked) {
                    router.push("/pricing");
                    return;
                  }
                  router.push(
                    `/practice?character=${tutor.id}&personality=${personality}`
                  );
                }}
                sx={{ fontWeight: 700 }}
              >
                {locked ? "Upgrade untuk buka" : `Latihan dengan ${tutor.name}`}
              </Button>
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
}
