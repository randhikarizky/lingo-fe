import { Theme } from "@mui/material/styles";
import { m3Interactive, m3Transition } from "../../motion";

export function radio(theme: Theme) {
  return {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          ...theme.typography.body2,
          fontWeight: 600,
        },
        root: {
          marginLeft: 0,
          marginRight: 0,
          minHeight: 48,
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1.25),
          borderRadius: 100,
          ...m3Interactive(theme, 0.88),
          "&:hover": {
            backgroundColor: theme.palette.background.surfaceContainerHigh,
          },
          "& svg": {
            transition: m3Transition(theme, "transform"),
          },
          "&.Mui-checked svg": {
            animation: "m3ExpressivePop 300ms cubic-bezier(0.34, 1.4, 0.64, 1)",
          },
        },
      },
    },
  };
}
