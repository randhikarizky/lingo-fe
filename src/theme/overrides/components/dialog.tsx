import { Theme } from "@mui/material/styles";
import { DialogProps } from "@mui/material/Dialog";
import { m3SurfaceEnter } from "../../motion";

export function dialog(theme: Theme) {
  return {
    MuiDialog: {
      styleOverrides: {
        paper: ({ ownerState }: { ownerState: DialogProps }) => ({
          boxShadow: theme.customShadows.dialog,
          borderRadius: 28,
          padding: theme.spacing(1),
          backgroundColor: theme.palette.background.paper,
          backgroundImage: "none",
          border: `1px solid ${theme.palette.divider}`,
          ...m3SurfaceEnter(),
          ...(!ownerState.fullScreen && {
            margin: theme.spacing(2),
          }),
        }),
        paperFullScreen: {
          borderRadius: 0,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
          fontSize: "1.5rem",
          fontWeight: 800,
          letterSpacing: "-0.02em",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(0, 3),
        },
        dividers: {
          borderTop: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
          paddingBottom: theme.spacing(3),
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
          gap: theme.spacing(1.5),
          "& > :not(:first-of-type)": {
            marginLeft: 0,
          },
        },
      },
    },
  };
}
