"use client";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

import { LINGORA_RADIUS } from "@/global/constants/lingora-brand";
import { M3_MOTION_EASE } from "@/theme/animate/m3-page";

type Props = {
  email: string;
  password: string;
  showPassword: boolean;
  errorMessage: string | null;
  isPending: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (event: React.FormEvent) => void;
};

export default function LoginCardV2({
  email,
  password,
  showPassword,
  errorMessage,
  isPending,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}: Props) {
  return (
    <Card
      component={m.form}
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: M3_MOTION_EASE.decelerate, delay: 0.14 }}
      sx={{
        p: 2.5,
        borderRadius: `${LINGORA_RADIUS.section}px`,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Selamat Datang Kembali di Lingora AI
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lanjutkan perjalanan belajarmu.
          </Typography>
        </Box>

        {errorMessage && (
          <Box
            component={m.div}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
              p: 1.25,
              borderRadius: `${LINGORA_RADIUS.item}px`,
              bgcolor: "error.main",
              color: "error.contrastText",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {errorMessage}
            </Typography>
          </Box>
        )}

        <Stack spacing={1.5}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            required
            fullWidth
            disabled={isPending}
            slotProps={{
              input: {
                sx: { borderRadius: `${LINGORA_RADIUS.item}px` },
              },
            }}
          />

          <TextField
            label="Kata Sandi"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            required
            fullWidth
            disabled={isPending}
            slotProps={{
              input: {
                sx: { borderRadius: `${LINGORA_RADIUS.item}px` },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                      onClick={onTogglePassword}
                      edge="end"
                      disabled={isPending}
                      size="small"
                    >
                      {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 600, textAlign: "right", display: "block" }}
        >
          Lupa Kata Sandi
        </Typography>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : undefined}
          sx={{ fontWeight: 800, borderRadius: `${LINGORA_RADIUS.item}px` }}
        >
          {isPending ? "Masuk..." : "Masuk"}
        </Button>
      </Stack>
    </Card>
  );
}
