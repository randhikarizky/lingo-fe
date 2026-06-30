import { LINGORA_RADIUS } from "@/global/constants/lingora-brand";

export const PRICING_RADIUS = LINGORA_RADIUS;

export const PRICING_SECTION_SPACING = 3.5;

export const FAQ_BOTTOM_SPACING = 120;

export const pricingToggleGroupSx = {
  position: "relative",
  borderRadius: `${LINGORA_RADIUS.panel}px`,
  bgcolor: "action.hover",
  p: 0.5,
  gap: 0,
  boxShadow: "none",
  border: "none",
  width: "100%",
  display: "flex",
  "& .MuiToggleButtonGroup-grouped": {
    border: "none !important",
    borderRadius: `${LINGORA_RADIUS.item}px !important`,
    margin: "0 !important",
    minHeight: 44,
    flex: 1,
    zIndex: 1,
    bgcolor: "transparent",
    fontWeight: 700,
    "&.Mui-selected": {
      bgcolor: "transparent",
      color: "primary.main",
    },
  },
} as const;

export const STICKY_UPGRADE_BAR_HEIGHT = 88;

export const pricingCtaSx = {
  fontWeight: 800,
  minHeight: 48,
  borderRadius: `${LINGORA_RADIUS.item}px`,
  boxShadow: (theme: { palette: { primary: { main: string } } }) =>
    `0 4px 20px ${theme.palette.primary.main}44`,
  "&:hover": {
    boxShadow: (theme: { palette: { primary: { main: string } } }) =>
      `0 6px 28px ${theme.palette.primary.main}55`,
  },
} as const;
