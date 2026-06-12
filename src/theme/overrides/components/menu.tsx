import { Theme } from "@mui/material/styles";
import { menuItem } from "../../css";
import { m3SurfaceEnter } from "../../motion";

export function menu(theme: Theme) {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ...menuItem(theme),
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          backgroundColor: theme.palette.background.paper,
          backgroundImage: "none",
          boxShadow: "none",
          border: `1px solid ${theme.palette.divider}`,
          padding: theme.spacing(0.5),
          ...m3SurfaceEnter(),
        },
        list: {
          padding: theme.spacing(0.5),
        },
      },
    },
  };
}
