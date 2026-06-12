import { Theme } from "@mui/material/styles";
import { m3SurfaceEnter } from "../../motion";

export function tooltip(theme: Theme) {
  const lightMode = theme.palette.mode === "light";

  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: lightMode ? "#1C1B1A" : "#F5EFEB",
          color: lightMode ? "#F5EFEB" : "#1C1B1A",
          fontWeight: 700,
          fontSize: 13,
          borderRadius: 12,
          padding: theme.spacing(1, 1.5),
          boxShadow: "none",
          ...m3SurfaceEnter(),
        },
        arrow: {
          color: lightMode ? "#1C1B1A" : "#F5EFEB",
        },
      },
    },
  };
}
