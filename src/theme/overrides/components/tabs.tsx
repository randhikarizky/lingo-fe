import { alpha, Theme } from "@mui/material/styles";
import { tabClasses } from "@mui/material/Tab";
import { m3Interactive, m3Transition } from "../../motion";

export function tabs(theme: Theme) {
  return {
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
          backgroundColor: theme.palette.background.surfaceContainer,
          borderRadius: 100,
          padding: 4,
        },
        flexContainer: {
          gap: 4,
        },
        indicator: {
          height: "100%",
          borderRadius: 100,
          backgroundColor:
            theme.palette.primary.tonalContainer ??
            alpha(theme.palette.primary.main, 0.14),
          transition: m3Transition(theme, "all", 300),
          zIndex: 0,
        },
        scrollButtons: {
          width: 48,
          height: 48,
          borderRadius: 100,
          ...m3Interactive(theme, 0.94),
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1, 2.5),
          opacity: 1,
          minWidth: 48,
          minHeight: 44,
          zIndex: 1,
          borderRadius: 100,
          fontWeight: 700,
          textTransform: "none",
          color: theme.palette.text.secondary,
          ...m3Interactive(theme, 0.96),
          [`&.${tabClasses.selected}`]: {
            color: theme.palette.primary.onTonalContainer ?? theme.palette.primary.dark,
            fontWeight: 800,
          },
        },
      },
    },
  };
}
