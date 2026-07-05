import { Theme } from "@mui/material/styles";
import { m3Interactive } from "../../motion";

export function treeView(theme: Theme) {
  return {
    MuiTreeItem: {
      styleOverrides: {
        label: {
          ...theme.typography.body2,
          fontWeight: 600,
          borderRadius: 12,
          padding: theme.spacing(0.75, 1),
          ...m3Interactive(theme, 0.98),
        },
        iconContainer: {
          width: "auto",
          marginRight: theme.spacing(0.5),
        },
        content: {
          borderRadius: 12,
          padding: theme.spacing(0.5, 1),
          "&:hover": {
            backgroundColor: theme.palette.background.surfaceContainerHigh,
          },
          "&.Mui-selected": {
            backgroundColor:
              theme.palette.primary.tonalContainer ?? theme.palette.action.selected,
            "&:hover": {
              backgroundColor:
                theme.palette.primary.tonalContainer ?? theme.palette.action.selected,
            },
          },
          "&.Mui-focused": {
            backgroundColor: theme.palette.background.surfaceContainerHigh,
          },
        },
      },
    },
  };
}
