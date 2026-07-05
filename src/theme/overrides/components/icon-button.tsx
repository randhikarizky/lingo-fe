import { Theme } from "@mui/material/styles";
import { m3Interactive } from "../../motion";

export function iconButton(theme: Theme) {
  return {
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          width: 48,
          height: 48,
          ...m3Interactive(theme, 0.9),
          "&:hover": {
            backgroundColor: theme.palette.background.surfaceContainerHigh,
          },
        },
        sizeSmall: {
          width: 40,
          height: 40,
          borderRadius: 12,
        },
        sizeLarge: {
          width: 56,
          height: 56,
          borderRadius: 20,
        },
      },
    },
  };
}
