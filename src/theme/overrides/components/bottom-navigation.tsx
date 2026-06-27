import { Theme, alpha } from "@mui/material/styles";
import { M3_DURATION, M3_EASING } from "../../motion";

export function bottomNavigation(theme: Theme) {
  return {
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 80,
          boxShadow: "none",
          borderTop: "none",
          backgroundColor: theme.palette.background.default,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: "auto",
          minHeight: 56,
          padding: "6px 12px 8px",
          color: theme.palette.text.secondary,
          borderRadius: 0,
          margin: theme.spacing(0.5, 0.75),
          transition: `color ${M3_DURATION.medium}ms ${M3_EASING.emphasizedDecelerate}, transform ${M3_DURATION.medium}ms ${M3_EASING.expressive}`,
          "&.Mui-selected": {
            color: theme.palette.primary.main,
            backgroundColor: "transparent",
            "& .MuiBottomNavigationAction-icon": {
              backgroundColor: alpha(theme.palette.primary.main, 0.14),
              borderRadius: 100,
              padding: "6px 22px",
              transform: "scale(1.05)",
            },
          },
        },
        icon: {
          transition: `background-color ${M3_DURATION.medium}ms ${M3_EASING.emphasizedDecelerate}, transform ${M3_DURATION.medium}ms ${M3_EASING.expressiveOvershoot}, padding ${M3_DURATION.medium}ms ${M3_EASING.expressive}`,
        },
        label: {
          fontSize: "0.75rem",
          fontWeight: 600,
          marginTop: 4,
          "&.Mui-selected": {
            fontSize: "0.75rem",
            fontWeight: 800,
          },
        },
      },
    },
  };
}
