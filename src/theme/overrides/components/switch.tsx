import { Theme, alpha } from "@mui/material/styles";
import { SwitchProps, switchClasses } from "@mui/material/Switch";
import { M3_DURATION, M3_EASING } from "../../motion";

export function switches(theme: Theme) {
  const lightMode = theme.palette.mode === "light";

  const rootStyles = (ownerState: SwitchProps) => ({
    padding: 8,
    width: 58,
    height: 40,
    ...(ownerState.size === "small" && {
      padding: 6,
      width: 42,
      height: 30,
    }),
    [`& .${switchClasses.thumb}`]: {
      width: 18,
      height: 18,
      boxShadow: "none",
      color: theme.palette.common.white,
      transition: `width ${M3_DURATION.medium}ms ${M3_EASING.expressive}, height ${M3_DURATION.medium}ms ${M3_EASING.expressive}, transform ${M3_DURATION.medium}ms ${M3_EASING.expressive}`,
      ...(ownerState.size === "small" && {
        width: 14,
        height: 14,
      }),
    },
    [`& .${switchClasses.track}`]: {
      opacity: 1,
      borderRadius: 20,
      backgroundColor: alpha(theme.palette.grey[500], 0.32),
      transition: theme.transitions.create("background-color", {
        duration: theme.transitions.duration.shorter,
      }),
    },
    [`& .${switchClasses.switchBase}`]: {
      left: 2,
      padding: 11,
      ...(ownerState.size === "small" && {
        padding: 8,
      }),
      [`&.${switchClasses.checked}`]: {
        transform: "translateX(18px)",
        [`&+.${switchClasses.track}`]: {
          opacity: 1,
          backgroundColor: alpha(theme.palette.primary.main, 0.5),
        },
        [`& .${switchClasses.thumb}`]: {
          width: 22,
          height: 22,
          transform: "translate(-2px, -2px)",
          ...(ownerState.size === "small" && {
            width: 16,
            height: 16,
            transform: "translate(-1px, -1px)",
          }),
        },
        ...(ownerState.size === "small" && {
          transform: "translateX(12px)",
        }),
      },
      [`&.${switchClasses.disabled}`]: {
        [`& .${switchClasses.thumb}`]: {
          opacity: lightMode ? 1 : 0.48,
        },
        [`&+.${switchClasses.track}`]: {
          opacity: 0.24,
        },
      },
    },
  });

  return {
    MuiSwitch: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: SwitchProps }) => rootStyles(ownerState),
      },
    },
  };
}
