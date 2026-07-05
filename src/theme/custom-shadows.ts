import { alpha } from "@mui/material/styles";

import { primary } from "./palette";

export function customShadows() {
  return {
    z1: "none",
    z4: "none",
    z8: "none",
    z12: "none",
    z16: "none",
    z20: "none",
    z24: "none",
    card: "none",
    appBar: "none",
    bottomNav: "none",
    dropdown: "0px 8px 30px rgba(28, 27, 26, 0.08)",
    dialog: "0px 24px 48px -12px rgba(28, 27, 26, 0.15)",
    fab: `0px 8px 24px -4px ${alpha(primary.main, 0.3)}`,
    primary: "none",
    secondary: "none",
    info: "none",
    success: "none",
    warning: "none",
    error: "none",
  };
}
