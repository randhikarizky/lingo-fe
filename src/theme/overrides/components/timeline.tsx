import { Theme } from "@mui/material/styles";
import { m3Transition } from "../../motion";

export function timeline(theme: Theme) {
  return {
    MuiTimelineDot: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          margin: theme.spacing(0.75, 0),
          transition: m3Transition(theme, "transform"),
        },
        filled: {
          backgroundColor:
            theme.palette.primary.tonalContainer ?? theme.palette.primary.light,
          color: theme.palette.primary.onTonalContainer ?? theme.palette.primary.dark,
        },
        outlined: {
          backgroundColor: theme.palette.background.paper,
          borderWidth: 3,
          borderColor: theme.palette.primary.main,
        },
      },
    },
    MuiTimelineConnector: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.divider,
          width: 3,
          borderRadius: 100,
        },
      },
    },
    MuiTimelineContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1.5, 2),
        },
      },
    },
  };
}
