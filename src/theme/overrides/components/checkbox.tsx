import { Theme } from "@mui/material/styles";
import { m3Interactive, m3Transition } from "../../motion";

export function checkbox(theme: Theme) {
  return {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1.25),
          borderRadius: 12,
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
