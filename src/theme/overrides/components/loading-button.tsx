import { Theme } from "@mui/material/styles";
import { m3Transition } from "../../motion";

export function loadingButton(theme: Theme) {
  return {
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          transition: m3Transition(theme, ["background-color", "transform", "opacity"]),
          "&:active": { transform: "scale(0.97)" },
          "& .MuiLoadingButton-loadingIndicatorStart": { left: 14 },
          "& .MuiLoadingButton-loadingIndicatorEnd": { right: 14 },
        },
      },
    },
  };
}
