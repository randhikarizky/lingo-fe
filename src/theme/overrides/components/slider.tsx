import { alpha, Theme } from "@mui/material/styles";
import { sliderClasses } from "@mui/material/Slider";
import { m3Transition } from "../../motion";

export function slider(theme: Theme) {
  return {
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 8,
          padding: "16px 0",
          [`&.${sliderClasses.disabled}`]: {
            color: theme.palette.action.disabled,
          },
        },
        rail: {
          opacity: 1,
          height: 8,
          borderRadius: 100,
          backgroundColor: theme.palette.background.surfaceContainerHigh,
        },
        track: {
          height: 8,
          borderRadius: 100,
          border: "none",
        },
        thumb: {
          width: 24,
          height: 24,
          boxShadow: "none",
          border: `3px solid ${theme.palette.primary.main}`,
          backgroundColor: theme.palette.background.paper,
          transition: m3Transition(theme, ["transform", "width", "height", "box-shadow"]),
          "&:hover, &.Mui-active": {
            boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.16)}`,
            transform: "scale(1.15)",
          },
          "&.Mui-focusVisible": {
            boxShadow: `0 0 0 6px ${alpha(theme.palette.primary.main, 0.24)}`,
          },
        },
        mark: {
          width: 4,
          height: 4,
          borderRadius: 100,
          backgroundColor: theme.palette.text.disabled,
        },
        markLabel: {
          fontSize: 13,
          fontWeight: 600,
          color: theme.palette.text.secondary,
        },
        valueLabel: {
          borderRadius: 12,
          fontWeight: 700,
          padding: theme.spacing(0.5, 1),
          backgroundColor: theme.palette.primary.main,
          "&:before": { display: "none" },
        },
      },
    },
  };
}
