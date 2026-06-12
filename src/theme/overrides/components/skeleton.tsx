import { alpha, Theme } from "@mui/material/styles";

export function skeleton(theme: Theme) {
  const base = theme.palette.background.surfaceContainerHigh;
  const highlight = alpha(theme.palette.primary.main, 0.08);

  return {
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: base,
          backgroundImage: `linear-gradient(90deg, ${base} 0%, ${highlight} 50%, ${base} 100%)`,
          backgroundSize: "200% 100%",
          animation: "m3Shimmer 1.6s ease-in-out infinite",
        },
        rounded: {
          borderRadius: 16,
        },
        rectangular: {
          borderRadius: 12,
        },
        circular: {
          borderRadius: "50%",
        },
      },
    },
  };
}
