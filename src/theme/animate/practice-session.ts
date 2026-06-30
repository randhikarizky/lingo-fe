import { M3_MOTION_EASE } from "./m3-page";

export const PRACTICE_FOCUS_TIMING = {
  setupExitMs: 480,
  sessionEnterMs: 450,
  sheetExpandMs: 0.3,
  sheetCollapseMs: 0.25,
  inputFocusDelayMs: 420,
  staggerStep: 0.07,
} as const;

export const FOCUS_HANDOFF_KEY = "lingora:focus-handoff";

export const focusSetupContainerVariants = {
  idle: { opacity: 1, scale: 1, y: 0 },
  launching: {
    opacity: 0,
    scale: 0.94,
    y: -28,
    transition: { duration: 0.42, ease: M3_MOTION_EASE.accelerate },
  },
};

export const focusSetupCardVariants = {
  idle: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
  launching: {
    opacity: 0,
    scale: 0.72,
    y: -96,
    filter: "blur(4px)",
    transition: { duration: 0.45, ease: M3_MOTION_EASE.expressive },
  },
};

export const focusSetupFadeVariants = {
  idle: { opacity: 1, y: 0 },
  launching: {
    opacity: 0,
    y: 12,
    transition: { duration: 0.32, ease: M3_MOTION_EASE.accelerate },
  },
};

export const focusSessionContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: PRACTICE_FOCUS_TIMING.staggerStep,
      delayChildren: 0.04,
    },
  },
};

export const focusSessionItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: M3_MOTION_EASE.decelerate },
  },
};

export const focusChatAreaVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.48, ease: M3_MOTION_EASE.decelerate },
  },
};

export const focusInputVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: M3_MOTION_EASE.decelerate },
  },
};

export const focusSheetCollapsedVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: M3_MOTION_EASE.decelerate },
  },
};
