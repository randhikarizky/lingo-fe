import { alpha, Theme } from "@mui/material/styles";
import { M3_DURATION, M3_EASING } from "../../motion";

export function backdrop(theme: Theme) {
  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(
            theme.palette.mode === "light" ? "#1C1B1A" : "#000000",
            0.45
          ),
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          transition: `opacity ${M3_DURATION.medium}ms ${M3_EASING.emphasizedDecelerate}`,
        },
        invisible: {
          background: "transparent",
          backdropFilter: "none",
        },
      },
    },
  };
}
