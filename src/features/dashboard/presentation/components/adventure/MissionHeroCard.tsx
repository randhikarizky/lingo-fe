"use client";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useRouter } from "next/navigation";

import { useGetConversationDetail } from "@/features/conversation/presentation/controller/conversation.controller";
import { M3_MOTION_EASE } from "@/theme/animate/m3-page";
import {
  computeGoalProgress,
  missionMetaFromConversation,
  missionMetaFromLastSession,
  type MissionCardState,
} from "../../utils/dashboard.utils";
import { DASHBOARD_HERO, DASHBOARD_RADIUS } from "./dashboard.tokens";

type Props = {
  state: MissionCardState;
};

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{ color: DASHBOARD_HERO.textMuted, fontWeight: 600, display: "block" }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: DASHBOARD_HERO.text, fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function MissionHeroCard({ state }: Props) {
  const router = useRouter();

  const activeId = state.kind === "continue" ? state.conversation.id : "";
  const { data: detail } = useGetConversationDetail(activeId);
  const progress =
    state.kind === "continue"
      ? detail
        ? computeGoalProgress(detail.sessionGoals)
        : state.progress
      : 0;

  if (state.kind === "first") {
    return (
      <Box
        component={m.div}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: M3_MOTION_EASE.decelerate }}
        sx={{
          p: 2.5,
          borderRadius: `${DASHBOARD_RADIUS.section}px`,
          background: DASHBOARD_HERO.bg,
          border: DASHBOARD_HERO.border,
          boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: DASHBOARD_HERO.gold, fontWeight: 800, letterSpacing: 1.4 }}
        >
          Misi Hari Ini
        </Typography>
        <Typography
          variant="h5"
          sx={{ color: DASHBOARD_HERO.text, fontWeight: 900, mt: 0.5, mb: 1 }}
        >
          Mulai pelajaran pertamamu
        </Typography>
        <Typography variant="body2" sx={{ color: DASHBOARD_HERO.textMuted, mb: 2.5 }}>
          Pilih tutor dan skenario — petualanganmu dimulai di sini.
        </Typography>
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<PlayArrowRoundedIcon />}
          onClick={() => router.push("/practice")}
          sx={{
            bgcolor: DASHBOARD_HERO.gold,
            color: "#1a1240",
            fontWeight: 800,
            "&:hover": { bgcolor: "#e5a832" },
          }}
        >
          Mulai Pelajaran Pertama
        </Button>
      </Box>
    );
  }

  if (state.kind === "completed") {
    return (
      <Box
        component={m.div}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: M3_MOTION_EASE.decelerate }}
        sx={{
          p: 2.5,
          borderRadius: `${DASHBOARD_RADIUS.section}px`,
          background: DASHBOARD_HERO.bg,
          border: DASHBOARD_HERO.border,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
          <CheckCircleRoundedIcon sx={{ color: DASHBOARD_HERO.gold }} />
          <Typography variant="h6" sx={{ color: DASHBOARD_HERO.text, fontWeight: 900 }}>
            Misi Hari Ini Selesai 🎉
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: DASHBOARD_HERO.textMuted, mb: 2 }}>
          Kerja bagus hari ini. Coba {state.nextLabel} berikutnya — AI menyarankan
          lanjutkan streak-mu.
        </Typography>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => router.push("/practice")}
          sx={{
            bgcolor: DASHBOARD_HERO.gold,
            color: "#1a1240",
            fontWeight: 800,
            "&:hover": { bgcolor: "#e5a832" },
          }}
        >
          Mulai Misi Berikutnya
        </Button>
      </Box>
    );
  }

  const meta =
    state.kind === "continue"
      ? missionMetaFromConversation(state.conversation)
      : "scenarioId" in state.config
        ? missionMetaFromLastSession(state.config)
        : missionMetaFromConversation(state.config);

  const ctaLabel = "Lanjutkan Belajar";

  return (
    <Box
      component={m.div}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: M3_MOTION_EASE.decelerate }}
      sx={{
        p: 2.5,
        borderRadius: `${DASHBOARD_RADIUS.section}px`,
        background: DASHBOARD_HERO.bg,
        border: DASHBOARD_HERO.border,
        boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
      }}
    >
      <Typography
        variant="overline"
        sx={{ color: DASHBOARD_HERO.gold, fontWeight: 800, letterSpacing: 1.4 }}
      >
        Misi Hari Ini
      </Typography>
      <Typography
        variant="h5"
        sx={{ color: DASHBOARD_HERO.text, fontWeight: 900, mt: 0.5, mb: 2 }}
      >
        {meta.scenarioLabel}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1.5,
          mb: state.kind === "continue" ? 2 : 2.5,
        }}
      >
        <MetaRow label="Tutor" value={meta.tutorName} />
        <MetaRow label="Tingkat" value={meta.difficultyLabel} />
        <MetaRow label="Estimasi" value={`${meta.duration} Menit`} />
        {state.kind === "continue" && <MetaRow label="Progres" value={`${progress}%`} />}
      </Box>

      {state.kind === "continue" && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mb: 2.5,
            height: 8,
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.12)",
            "& .MuiLinearProgress-bar": { bgcolor: DASHBOARD_HERO.gold, borderRadius: 4 },
          }}
        />
      )}

      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={<PlayArrowRoundedIcon />}
        onClick={() => router.push(meta.href)}
        sx={{
          bgcolor: DASHBOARD_HERO.gold,
          color: "#1a1240",
          fontWeight: 800,
          "&:hover": { bgcolor: "#e5a832" },
        }}
      >
        {ctaLabel}
      </Button>
    </Box>
  );
}
