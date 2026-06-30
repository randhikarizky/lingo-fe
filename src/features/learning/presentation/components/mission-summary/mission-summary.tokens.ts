import { alpha } from "@mui/material/styles";

/** Parent > child. Explicit px — jangan pakai multiplier theme (24 × n). */
export const MISSION_RADIUS = {
  section: 20,
  panel: 12,
  item: 8,
  inset: 6,
  track: 999,
} as const;

export const MISSION_HERO = {
  bg: "linear-gradient(145deg, #1a1240 0%, #0d0818 55%, #12102a 100%)",
  border: "1px solid rgba(245,185,66,0.22)",
  panelBg: "rgba(255,255,255,0.06)",
  panelBorder: "1px solid rgba(255,255,255,0.08)",
  itemBg: "rgba(255,255,255,0.05)",
  gold: "#F5B942",
  text: "#F5EFEB",
  textMuted: "rgba(255,255,255,0.55)",
} as const;

/** Nested surface on dark section cards — readable di light & dark mode. */
export function missionNestedSurface(accent: "neutral" | "gold" | "primary" = "neutral") {
  if (accent === "gold") {
    return {
      bgcolor: alpha("#F5B942", 0.1),
      border: "1px solid",
      borderColor: alpha("#F5B942", 0.28),
      color: "text.primary",
    };
  }
  if (accent === "primary") {
    return {
      bgcolor: alpha("#FA7D19", 0.12),
      border: "1px solid",
      borderColor: alpha("#FA7D19", 0.32),
      color: "text.primary",
    };
  }
  return {
    bgcolor: "background.surfaceContainerHigh",
    border: "1px solid",
    borderColor: "divider",
    color: "text.primary",
  };
}

export const missionSectionCardSx = {
  borderRadius: `${MISSION_RADIUS.section}px`,
  overflow: "hidden",
} as const;
