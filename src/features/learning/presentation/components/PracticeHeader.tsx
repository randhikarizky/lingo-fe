"use client";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";

import AnimatedNumber from "@/features/dashboard/presentation/components/AnimatedNumber";
import GoalProgressPulse from "./GoalProgressPulse";
import { M3_MOTION_EASE } from "@/theme/animate/m3-page";

type Props = {
  scenarioLabel: string;
  tutorName: string;
  difficultyLabel: string;
  achievedGoals: number;
  totalGoals: number;
  goalPulseKey?: number;
  isPanelExpanded?: boolean;
  onExpandPanel: () => void;
  onEndSession?: () => void;
  onOpenHistory?: () => void;
  isSessionCompleted?: boolean;
  isVoiceBusy?: boolean;
};

export default function PracticeHeader({
  scenarioLabel,
  tutorName,
  difficultyLabel,
  achievedGoals,
  totalGoals,
  goalPulseKey = 0,
  isPanelExpanded = false,
  onExpandPanel,
  onEndSession,
  onOpenHistory,
  isSessionCompleted,
  isVoiceBusy,
}: Props) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 1,
        flexShrink: 0,
        minHeight: 56,
        maxHeight: "10vh",
      }}
    >
      <Stack
        component={m.button}
        type="button"
        onClick={onExpandPanel}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.15, ease: M3_MOTION_EASE.decelerate }}
        sx={{
          flex: 1,
          minWidth: 0,
          border: "none",
          background: "none",
          cursor: "pointer",
          textAlign: "left",
          p: 0,
          color: "inherit",
          font: "inherit",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.3 }} noWrap>
          {scenarioLabel}
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mt: 0.25 }}>
          <Typography variant="body2" color="text.secondary" noWrap component="span">
            {tutorName} • {difficultyLabel} •{" "}
          </Typography>
          {totalGoals > 0 ? (
            <GoalProgressPulse pulseKey={goalPulseKey}>
              <Typography variant="body2" color="text.secondary" noWrap component="span">
                🎯 <AnimatedNumber value={achievedGoals} /> / {totalGoals} Tujuan
              </Typography>
            </GoalProgressPulse>
          ) : (
            <Typography variant="body2" color="text.secondary" noWrap component="span">
              Sesi aktif
            </Typography>
          )}
          <Box
            component={m.div}
            animate={{ rotate: isPanelExpanded ? 180 : 0 }}
            transition={{ duration: 0.25, ease: M3_MOTION_EASE.decelerate }}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
          </Box>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={0.25} sx={{ flexShrink: 0 }}>
        {!isSessionCompleted && onEndSession && (
          <IconButton
            size="small"
            aria-label="Akhiri sesi"
            onClick={onEndSession}
            disabled={isVoiceBusy}
          >
            <FlagRoundedIcon fontSize="small" />
          </IconButton>
        )}
        {onOpenHistory && (
          <IconButton size="small" aria-label="Riwayat" onClick={onOpenHistory}>
            <HistoryRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
}
