"use client";



import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

import { useRouter } from "next/navigation";

import { M3_MOTION_EASE } from "@/theme/animate/m3-page";
import LoadingTips from "@/global/components/Loading/LoadingTips";
import CharacterSelectCard from "@/global/components/Animation/CharacterSelectCard";

import { useGetMe } from "@/features/auth/presentation/controller/auth.controller";

const AI_CHARACTERS = [
  { id: "maya", name: "Maya", emoji: "👩‍🏫", role: "Guru santai" },
  { id: "alex", name: "Alex", emoji: "🧑‍💻", role: "Teman ngobrol" },
  { id: "sora", name: "Sora", emoji: "🌸", role: "Coach positif" },
  { id: "ken", name: "Ken", emoji: "🎧", role: "Partner latihan" },
];

const ROADMAP = [
  { level: 1, title: "Perkenalan", status: "done" },
  { level: 2, title: "Daily Chat", status: "active" },
  { level: 3, title: "Cerita Singkat", status: "locked" },
  { level: 4, title: "Debat Mini", status: "locked" },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.36, ease: M3_MOTION_EASE.decelerate },
  }),
};

export default function DashboardComponent() {
  const router = useRouter();
  const { data: user, isLoading } = useGetMe();

  if (isLoading) {
    return <LoadingTips label="Menyiapkan ruang belajarmu..." />;
  }

  return (
    <Stack
      spacing={2.5}
      component={m.div}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      <Box component={m.div} variants={sectionVariants} custom={0}>
        <Typography variant="h5">
          Halo, {user?.name?.split(" ")[0] ?? "teman"}! 👋
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Siap latihan bahasa hari ini?
        </Typography>
      </Box>

      <Card
        component={m.div}
        variants={sectionVariants}
        custom={0.05}
        sx={{ p: 2.5 }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="subtitle2">Progres Hari Ini</Typography>
            <Chip label="Level 2" size="small" color="primary" variant="outlined" />
          </Stack>
          <LinearProgress variant="determinate" value={45} sx={{ borderRadius: 2, height: 8 }} />
          <Typography variant="caption" color="text.secondary">
            9 dari 20 menit target harian
          </Typography>
        </Stack>
      </Card>

      <Box component={m.div} variants={sectionVariants} custom={0.1}>
        <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
          Pilih Teman Ngobrol
        </Typography>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            overflowX: "auto",
            pb: 0.5,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {AI_CHARACTERS.map((char, index) => (
            <CharacterSelectCard key={char.id} {...char} index={index} />
          ))}
        </Stack>
      </Box>

      <Box component={m.div} variants={sectionVariants} custom={0.15}>
        <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
          Peta Belajar
        </Typography>
        <Stack spacing={1}>
          {ROADMAP.map((item) => (
            <Card
              key={item.level}
              sx={{
                p: 2,
                ...((item.status === "locked" || item.status === "done") && {
                  borderRadius: .5,
                }),
                opacity: item.status === "locked" ? 0.55 : 1,
                ...(item.status === "active" && {
                  bgcolor: "primary.tonalContainer",
                  color: "primary.onTonalContainer",
                }),
              }}
            >
              <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
                <Chip
                  label={`Lv ${item.level}`}
                  size="small"
                  color={item.status === "done" ? "success" : item.status === "active" ? "primary" : "default"}
                />
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.status === "done" ? "Selesai" : item.status === "active" ? "Aktif" : "Terkunci"}
                </Typography>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Box>

      <m.div
        variants={sectionVariants}
        custom={0.2}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.2, ease: M3_MOTION_EASE.expressive }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={() => router.push("/conversation?character=maya&personality=santai")}
        >
          Mulai Ngobrol Sekarang
        </Button>
      </m.div>
    </Stack>
  );
}