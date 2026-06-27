"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/material/styles";

const TIPS = [
  "Tip: Berani salah itu bagian dari belajar bahasa.",
  "Tip: Latih 10 menit setiap hari lebih efektif daripada 2 jam seminggu.",
  "Tip: Dengarkan cara AI mengucapkan, lalu tiru ritmenya.",
  "Tip: Jangan takut grammar — fokus pada komunikasi dulu.",
  "Tip: Ulangi kalimat favoritmu dengan suara keras.",
];

const fade = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

type Props = {
  label?: string;
};

export default function LoadingTips({ label = "Memuat..." }: Props) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        px: 3,
        textAlign: "center",
      }}
    >
      <CircularProgress color="primary" size={40} />
      <Typography variant="subtitle1" color="text.primary">
        {label}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ animation: `${fade} 3s ease-in-out infinite`, maxWidth: 280 }}
      >
        {TIPS[tipIndex]}
      </Typography>
    </Box>
  );
}
