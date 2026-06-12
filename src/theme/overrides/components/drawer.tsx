import { Theme } from "@mui/material/styles";
import { DrawerProps, drawerClasses } from "@mui/material/Drawer";
import { M3_DURATION, M3_EASING } from "../../motion";

export function drawer(theme: Theme) {
  return {
    MuiDrawer: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: DrawerProps }) => ({
          ...(ownerState.variant === "temporary" && {
            [`& .${drawerClasses.paper}`]: {
              backgroundColor: theme.palette.background.paper,
              backgroundImage: "none",
              boxShadow: "none",
              borderRadius:
                ownerState.anchor === "left"
                  ? "0 24px 24px 0"
                  : ownerState.anchor === "right"
                    ? "24px 0 0 24px"
                    : ownerState.anchor === "bottom"
                      ? "24px 24px 0 0"
                      : "0 0 24px 24px",
              border: `1px solid ${theme.palette.divider}`,
              transition: `transform ${M3_DURATION.enter}ms ${M3_EASING.emphasizedDecelerate}`,
            },
          }),
          ...(ownerState.variant === "permanent" && {
            [`& .${drawerClasses.paper}`]: {
              backgroundColor: theme.palette.background.default,
              borderRight: `1px solid ${theme.palette.divider}`,
              boxShadow: "none",
            },
          }),
        }),
      },
    },
  };
}
