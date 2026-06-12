import { Theme } from "@mui/material/styles";

export function appBar(theme: Theme) {
  return {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          borderBottom: "none",
        },
      },
    },
  };
}
