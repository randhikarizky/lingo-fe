import { Theme } from "@mui/material/styles";

export const M3_EASING = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  emphasizedDecelerate: "cubic-bezier(0.05, 0.7, 0.1, 1)",
  emphasizedAccelerate: "cubic-bezier(0.3, 0, 0.8, 0.15)",
  expressive: "cubic-bezier(0.34, 1.4, 0.64, 1)",
  expressiveOvershoot: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const M3_DURATION = {
  short: 150,
  medium: 250,
  long: 350,
  enter: 300,
  exit: 200,
} as const;

export function m3Transition(
  theme: Theme,
  props: string | string[] = "all",
  duration: number = M3_DURATION.medium,
  easing: string = M3_EASING.emphasizedDecelerate
) {
  return theme.transitions.create(props, { duration, easing });
}

export function m3Interactive(theme: Theme, scale = 0.96) {
  return {
    transition: m3Transition(theme, [
      "background-color",
      "color",
      "border-color",
      "transform",
      "box-shadow",
      "width",
      "height",
      "padding",
    ]),
    "&:active": {
      transform: `scale(${scale})`,
    },
  };
}

export function m3HoverLift(theme: Theme) {
  return {
    transition: m3Transition(theme, ["transform", "background-color"]),
    "&:hover": {
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "scale(0.97)",
    },
  };
}

export const m3Keyframes = {
  "@keyframes m3ExpressiveEnter": {
    from: {
      opacity: 0,
      transform: "scale(0.92) translateY(6px)",
    },
    to: {
      opacity: 1,
      transform: "scale(1) translateY(0)",
    },
  },
  "@keyframes m3ExpressivePop": {
    "0%": { transform: "scale(0.85)" },
    "60%": { transform: "scale(1.06)" },
    "100%": { transform: "scale(1)" },
  },
  "@keyframes m3Shimmer": {
    "0%": { backgroundPosition: "-200% 0" },
    "100%": { backgroundPosition: "200% 0" },
  },
} as const;

export function m3SurfaceEnter() {
  return {
    animation: `m3ExpressiveEnter ${M3_DURATION.enter}ms ${M3_EASING.emphasizedDecelerate} forwards`,
  };
}
