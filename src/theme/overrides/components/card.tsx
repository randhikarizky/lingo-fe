import { Theme } from "@mui/material/styles";

export function card(theme: Theme) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          position: "relative",
          boxShadow: "none",
          borderRadius: 24,
          zIndex: 0,
          border: "none",
          backgroundColor: theme.palette.background.paper,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0),
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
        },
      },
    },
  };
}
