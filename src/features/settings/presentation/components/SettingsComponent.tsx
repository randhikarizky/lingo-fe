"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import LoadingTips from "@/global/components/Loading/LoadingTips";
import { useSettingsContext } from "@/theme/settings";
import { useGetMe, useLogout } from "@/features/auth/presentation/controller/auth.controller";
import { useSubscriptionMe } from "@/features/subscription/presentation/controller/subscription.controller";
import { getPlanLabel } from "@/features/subscription/domain/utils/subscription-access";
import type { ThemeMode } from "@/theme/settings/types";

export default function SettingsComponent() {
  const router = useRouter();
  const settings = useSettingsContext();
  const { data: user, isLoading } = useGetMe();
  const { data: subscription } = useSubscriptionMe();
  const logout = useLogout();

  if (isLoading) {
    return <LoadingTips label="Memuat pengaturan..." />;
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5">Pengaturan</Typography>
        <Typography variant="body2" color="text.secondary">
          Sesuaikan pengalaman belajarmu
        </Typography>
      </Box>

      <Card sx={{ p: 2.5 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Akun
        </Typography>
        <Typography variant="body1">{user?.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email}
        </Typography>
      </Card>

      <Card sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Langganan</Typography>
          <Typography variant="body2" color="text.secondary">
            Paket aktif: {subscription ? getPlanLabel(subscription.plan) : "Free"}
          </Typography>
          <Button variant="outlined" onClick={() => router.push("/pricing")}>
            Lihat Paket & Upgrade
          </Button>
        </Stack>
      </Card>

      <Card sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle2">Tampilan</Typography>

          <TextField
            select
            label="Mode Tema"
            value={settings.themeMode}
            onChange={(e) => settings.onUpdate("themeMode", e.target.value as ThemeMode)}
            fullWidth
            size="small"
          >
            <MenuItem value="system">Ikuti Sistem (disarankan)</MenuItem>
            <MenuItem value="light">Terang</MenuItem>
            <MenuItem value="dark">Gelap</MenuItem>
          </TextField>

          <TextField
            select
            label="Target Bahasa"
            defaultValue="en"
            fullWidth
            size="small"
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="id">Indonesia</MenuItem>
            <MenuItem value="ja">Japanese</MenuItem>
          </TextField>

          <TextField
            select
            label="Target Harian (menit)"
            defaultValue="20"
            fullWidth
            size="small"
          >
            <MenuItem value="10">10 menit</MenuItem>
            <MenuItem value="20">20 menit</MenuItem>
            <MenuItem value="30">30 menit</MenuItem>
          </TextField>
        </Stack>
      </Card>

      <Button
        variant="outlined"
        color="error"
        fullWidth
        onClick={() => logout.mutate()}
      >
        Keluar
      </Button>
    </Stack>
  );
}
