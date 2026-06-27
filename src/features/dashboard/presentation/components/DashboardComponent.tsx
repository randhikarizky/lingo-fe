"use client";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

import { useRouter } from "next/navigation";

import { M3_MOTION_EASE } from "@/theme/animate/m3-page";
import LoadingTips from "@/global/components/Loading/LoadingTips";
import CharacterSelectCard from "@/global/components/Animation/CharacterSelectCard";
import AnimatedNumber from "./AnimatedNumber";
import ActivityChart from "./ActivityChart";

import { useGetMe } from "@/features/auth/presentation/controller/auth.controller";
import {
  useProgressSummary,
  useProgressActivity,
} from "@/features/dashboard/presentation/controller/progress.controller";

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
  const { data: user, isLoading: isUserLoading } = useGetMe();
  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useProgressSummary();
  const {
    data: activity,
    isLoading: isActivityLoading,
    isError: isActivityError,
    refetch: refetchActivity,
  } = useProgressActivity();

  if (isUserLoading) {
    return <LoadingTips label="Menyiapkan ruang belajarmu..." />;
  }

  const isProgressLoading = isSummaryLoading || isActivityLoading;
  const isProgressError = isSummaryError || isActivityError;

  const handleRetry = () => {
    refetchSummary();
    refetchActivity();
  };

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

      {isProgressError ? (
        <Card
          component={m.div}
          variants={sectionVariants}
          custom={0.05}
          sx={{
            p: 3,
            textAlign: "center",
            borderColor: "error.light",
            borderWidth: 1,
            borderStyle: "solid",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="subtitle2" color="error" sx={{ fontWeight: 700, mb: 1 }}>
            Gagal memuat data perkembangan belajar
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
            Terjadi kesalahan koneksi atau server saat mengambil data statistik Anda.
          </Typography>
          <Button variant="outlined" color="primary" size="small" onClick={handleRetry}>
            Coba Lagi
          </Button>
        </Card>
      ) : isProgressLoading ? (
        <>
          {/* Skeleton Metrics Grid */}
          <Box
            component={m.div}
            variants={sectionVariants}
            custom={0.05}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
              gap: 2,
            }}
          >
            {[...Array(4)].map((_, i) => (
              <Card key={i} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton variant="text" width="60%" height={16} />
                <Skeleton variant="text" width="40%" height={28} />
              </Card>
            ))}
          </Box>

          {/* Skeleton Chart */}
          <Card
            component={m.div}
            variants={sectionVariants}
            custom={0.08}
            sx={{ p: 2.5 }}
          >
            <Skeleton variant="text" width="180px" height={20} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={130} sx={{ borderRadius: 1 }} />
          </Card>
        </>
      ) : (
        <>
          {/* Metrics Grid */}
          <Box
            component={m.div}
            variants={sectionVariants}
            custom={0.05}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
              gap: 2,
            }}
          >
            {/* Card 1: Percakapan */}
            <Card sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ fontSize: 24 }}>💬</Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Total Sesi
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                <AnimatedNumber value={summary?.conversationCount ?? 0} />
              </Typography>
            </Card>

            {/* Card 2: Total Pesan */}
            <Card sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ fontSize: 24 }}>✍️</Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Total Pesan
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                <AnimatedNumber value={summary?.messageCount ?? 0} />
              </Typography>
            </Card>

            {/* Card 3: Menit Berbicara */}
            <Card sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ fontSize: 24 }}>⏱️</Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Menit Latihan
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                <AnimatedNumber value={summary?.speakingMinutes ?? 0} />
              </Typography>
            </Card>

            {/* Card 4: Streak Latihan */}
            <Card
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                bgcolor: (summary?.currentStreak ?? 0) > 0 ? "primary.tonalContainer" : "background.paper",
                color: (summary?.currentStreak ?? 0) > 0 ? "primary.onTonalContainer" : "text.primary",
                transition: "background-color 0.3s ease, color 0.3s ease",
              }}
            >
              <Box sx={{ fontSize: 24 }}>🔥</Box>
              <Typography
                variant="caption"
                color={(summary?.currentStreak ?? 0) > 0 ? "inherit" : "text.secondary"}
                sx={{ fontWeight: 600 }}
              >
                Streak Latihan
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                <AnimatedNumber value={summary?.currentStreak ?? 0} /> Hari
              </Typography>
            </Card>
          </Box>

          {/* Activity Chart Card */}
          <Card
            component={m.div}
            variants={sectionVariants}
            custom={0.08}
            sx={{ p: 2.5 }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
              Aktivitas Belajar (30 Hari Terakhir)
            </Typography>
            <ActivityChart data={activity ?? []} />
          </Card>
        </>
      )}

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
                  borderRadius: 0.5,
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