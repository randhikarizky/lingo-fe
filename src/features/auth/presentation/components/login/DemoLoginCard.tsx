"use client";

import { m } from "framer-motion";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";

import { LINGORA_RADIUS } from "@/global/constants/lingora-brand";
import { M3_MOTION_EASE } from "@/theme/animate/m3-page";

type Props = {
  disabled?: boolean;
  onDemoLogin: () => void;
};

export default function DemoLoginCard({ disabled, onDemoLogin }: Props) {
  return (
    <Card
      component={m.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: M3_MOTION_EASE.decelerate, delay: 0.22 }}
      sx={{
        p: 2,
        borderRadius: `${LINGORA_RADIUS.panel}px`,
        border: "1px dashed",
        borderColor: "divider",
      }}
    >
      <Stack spacing={1.25}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
          Coba Demo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Jelajahi Lingora dengan akun demo — cukup satu ketuk.
        </Typography>
        <Button
          variant="outlined"
          fullWidth
          disabled={disabled}
          startIcon={<PlayCircleOutlineRoundedIcon />}
          onClick={onDemoLogin}
          sx={{ fontWeight: 700, borderRadius: `${LINGORA_RADIUS.item}px` }}
        >
          Masuk sebagai Demo
        </Button>
      </Stack>
    </Card>
  );
}
