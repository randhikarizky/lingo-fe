import { Theme, alpha } from "@mui/material/styles";
import { LinearProgressProps, linearProgressClasses } from "@mui/material/LinearProgress";
import { m3Transition, M3_DURATION } from "../../motion";

const COLORS = ["primary", "secondary", "info", "success", "warning", "error"] as const;

export function progress(theme: Theme) {
  const rootStyles = (ownerState: LinearProgressProps) => {
    const bufferVariant = ownerState.variant === "buffer";

    const defaultStyle = {
      borderRadius: 100,
      height: 10,
      [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 100,
        transition: m3Transition(theme, "transform", M3_DURATION.long),
      },
      ...(bufferVariant && {
        backgroundColor: "transparent",
      }),
    };

    const colorStyle = COLORS.map((color) => ({
      ...(ownerState.color === color && {
        backgroundColor: alpha(theme.palette[color].main, 0.2),
        [`& .${linearProgressClasses.bar}`]: {
          backgroundColor: theme.palette[color].main,
        },
      }),
    }));

    return [defaultStyle, ...colorStyle];
  };

  return {
    MuiLinearProgress: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: LinearProgressProps }) => rootStyles(ownerState),
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          animationDuration: "800ms",
        },
        circle: {
          strokeLinecap: "round",
        },
      },
    },
  };
}
