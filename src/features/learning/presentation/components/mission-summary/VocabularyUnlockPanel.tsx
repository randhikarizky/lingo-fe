"use client";

import { useState } from "react";
import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";

import { useSynthesize } from "@/features/conversation/presentation/controller/speech.controller";
import { useAudioPlayer } from "@/features/conversation/presentation/hooks/useAudioPlayer";
import { vocabularyExample } from "../../utils/mission-summary.utils";
import { MISSION_RADIUS, missionNestedSurface, missionSectionCardSx } from "./mission-summary.tokens";

type Props = {
  words: string[];
  scenarioLabel: string;
  conversationId: string;
};

export default function VocabularyUnlockPanel({
  words,
  scenarioLabel,
  conversationId,
}: Props) {
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const synthesize = useSynthesize();
  const audioPlayer = useAudioPlayer();

  if (words.length === 0) return null;

  const handlePlay = async (word: string) => {
    try {
      setPlayingWord(word);
      const result = await synthesize.mutateAsync({
        text: word,
        conversationId,
        language: "en-US",
      });
      await audioPlayer.play(result.blob);
    } finally {
      setPlayingWord(null);
    }
  };

  return (
    <Card sx={{ ...missionSectionCardSx, p: 2 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
        <LockOpenRoundedIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          Kosakata Terbuka
        </Typography>
      </Stack>

      <Stack spacing={0.75}>
        {words.map((word, index) => {
          const isOpen = expandedWord === word;
          return (
            <Box
              key={word}
              component={m.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              sx={{
                borderRadius: `${MISSION_RADIUS.item}px`,
                overflow: "hidden",
                ...(isOpen ? missionNestedSurface("primary") : missionNestedSurface("neutral")),
              }}
            >
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 1.5,
                  py: 1,
                  cursor: "pointer",
                }}
                onClick={() => setExpandedWord(isOpen ? null : word)}
              >
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                  Terbuka · {word}
                </Typography>
                <IconButton
                  size="small"
                  aria-label={`Putar ${word}`}
                  disabled={playingWord === word || synthesize.isPending}
                  onClick={(event) => {
                    event.stopPropagation();
                    void handlePlay(word);
                  }}
                >
                  <VolumeUpRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Collapse in={isOpen}>
                <Box
                  sx={{
                    px: 1.5,
                    pb: 1.25,
                    pt: 0,
                    mx: 1,
                    mb: 1,
                    borderRadius: `${MISSION_RADIUS.inset}px`,
                    bgcolor: "background.surfaceContainer",
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    Arti: kata kunci dari sesi latihanmu
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, color: "text.primary" }}>
                    {vocabularyExample(word, scenarioLabel)}
                  </Typography>
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Stack>
    </Card>
  );
}
