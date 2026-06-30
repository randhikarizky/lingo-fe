export const PROFILE_RADIUS = {
  section: 20,
  panel: 12,
  item: 8,
  inset: 6,
  sheet: 20,
  track: 999,
} as const;

export const profileSectionCardSx = {
  borderRadius: `${PROFILE_RADIUS.section}px`,
  overflow: "hidden",
} as const;

/** Reset pill container dari theme global ToggleButtonGroup */
export const profileToggleGroupSx = {
  borderRadius: `${PROFILE_RADIUS.panel}px`,
  bgcolor: "transparent",
  p: 0,
  gap: 0.75,
  boxShadow: "none",
  border: "none",
  "& .MuiToggleButtonGroup-grouped": {
    borderRadius: `${PROFILE_RADIUS.item}px !important`,
    border: "1px solid !important",
    borderColor: "divider !important",
    margin: "0 !important",
    minHeight: 40,
  },
  "& .MuiToggleButton-root": {
    borderRadius: `${PROFILE_RADIUS.item}px !important`,
  },
} as const;
