import { Theme } from "@mui/material/styles";
import { m3Interactive } from "../../motion";

export function breadcrumbs(theme: Theme) {
  return {
    MuiBreadcrumbs: {
      styleOverrides: {
        separator: {
          marginLeft: theme.spacing(1.5),
          marginRight: theme.spacing(1.5),
          color: theme.palette.text.disabled,
        },
        li: {
          display: "inline-flex",
          margin: theme.spacing(0.25, 0),
          "& > *": {
            ...theme.typography.body2,
            fontWeight: 600,
          },
          "& a": {
            borderRadius: 8,
            padding: theme.spacing(0.25, 0.75),
            ...m3Interactive(theme, 0.98),
            "&:hover": {
              backgroundColor: theme.palette.background.surfaceContainerHigh,
            },
          },
        },
      },
    },
  };
}
