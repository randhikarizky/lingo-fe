import { alpha, type Theme } from "@mui/material/styles";

export const DASHBOARD_RADIUS = {
  section: 20,
  panel: 12,
  item: 8,
  inset: 6,
} as const;

/** Highlight surface for dark dashboard — avoids light tonalContainer blocks. */
export function dashboardActiveSurface(theme: Theme) {
  return {
    bgcolor: alpha(theme.palette.primary.main, 0.14),
    border: "1px solid",
    borderColor: alpha(theme.palette.primary.main, 0.38),
    color: theme.palette.text.primary,
  };
}

export const DASHBOARD_HERO = {
  bg: "linear-gradient(145deg, #1a1240 0%, #0d0818 55%, #12102a 100%)",
  border: "1px solid rgba(245,185,66,0.22)",
  gold: "#F5B942",
  text: "#F5EFEB",
  textMuted: "rgba(255,255,255,0.55)",
} as const;

export const dashboardSectionSx = {
  borderRadius: `${DASHBOARD_RADIUS.section}px`,
  overflow: "hidden",
} as const;
