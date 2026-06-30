"use client";

import Box from "@mui/material/Box";
import { keyframes } from "@mui/material/styles";

const dotPulse = keyframes`
  0%, 80%, 100% { opacity: 0.25; transform: scale(0.85); }
  40% { opacity: 1; transform: scale(1); }
`;

export default function ThinkingDots() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, py: 0.25 }}>
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "text.secondary",
            animation: `${dotPulse} 1.2s ease-in-out infinite`,
            animationDelay: `${index * 0.18}s`,
          }}
        />
      ))}
    </Box>
  );
}
