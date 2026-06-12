import { Theme, alpha } from "@mui/material/styles";

const ELEVATION_KEYS = Array.from({ length: 25 }, (_, i) => `elevation${i}` as const);

export function paper(theme: Theme) {
  const elevationOverrides = ELEVATION_KEYS.reduce(
    (acc, key) => {
      acc[key] = { boxShadow: "none" };
      return acc;
    },
    {} as Record<string, { boxShadow: string }>
  );

  return {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 24,
          boxShadow: "none",
        },
        ...elevationOverrides,
        outlined: {
          borderColor: alpha(theme.palette.grey[500], 0.12),
          borderWidth: 1.5,
          boxShadow: "none",
        },
      },
    },
  };
}
