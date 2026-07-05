import { Theme } from "@mui/material/styles";
import { listItemButtonClasses } from "@mui/material/ListItemButton";
import { m3Interactive } from "../../motion";

export function list(theme: Theme) {
  return {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "inherit",
          minWidth: "auto",
          marginRight: theme.spacing(2),
        },
      },
    },
    MuiListItemAvatar: {
      styleOverrides: {
        root: {
          minWidth: "auto",
          marginRight: theme.spacing(2),
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: { margin: 0 },
        multiline: { margin: 0 },
        primary: { fontWeight: 600 },
        secondary: { fontWeight: 500 },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          minHeight: 56,
          borderRadius: 16,
          margin: theme.spacing(0.25, 1),
          padding: theme.spacing(1.25, 1.5),
          ...m3Interactive(theme, 0.98),
          "&:hover": {
            backgroundColor: theme.palette.background.surfaceContainerHigh,
          },
          [`&.${listItemButtonClasses.selected}`]: {
            fontWeight: 700,
            color: theme.palette.primary.onTonalContainer ?? theme.palette.primary.dark,
            backgroundColor:
              theme.palette.primary.tonalContainer ?? theme.palette.action.selected,
            "&:hover": {
              backgroundColor:
                theme.palette.primary.tonalContainer ?? theme.palette.action.selected,
            },
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  };
}
