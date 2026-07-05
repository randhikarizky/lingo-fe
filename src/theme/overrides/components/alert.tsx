import { Theme, alpha } from "@mui/material/styles";
import { AlertProps, alertClasses } from "@mui/material/Alert";
import { m3Interactive } from "../../motion";

const COLORS = ["info", "success", "warning", "error"] as const;

export function alert(theme: Theme) {
  const lightMode = theme.palette.mode === "light";

  const rootStyles = (ownerState: AlertProps) => {
    const standardVariant = ownerState.variant === "standard";
    const filledVariant = ownerState.variant === "filled";
    const outlinedVariant = ownerState.variant === "outlined";

    const colorStyle = COLORS.map((color) => ({
      ...(ownerState.severity === color && {
        ...(standardVariant && {
          color:
            theme.palette[color].onTonalContainer ??
            theme.palette[color][lightMode ? "darker" : "lighter"],
          backgroundColor:
            theme.palette[color].tonalContainer ??
            theme.palette[color][lightMode ? "lighter" : "darker"],
          [`& .${alertClasses.icon}`]: {
            color: theme.palette[color].main,
          },
        }),
        ...(filledVariant && {
          color: theme.palette[color].contrastText,
          backgroundColor: theme.palette[color].main,
        }),
        ...(outlinedVariant && {
          backgroundColor:
            theme.palette[color].tonalContainer ?? alpha(theme.palette[color].main, 0.08),
          color: theme.palette[color][lightMode ? "dark" : "light"],
          border: "none",
          [`& .${alertClasses.icon}`]: {
            color: theme.palette[color].main,
          },
        }),
      }),
    }));

    return [...colorStyle];
  };

  return {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: AlertProps }) => ({
          borderRadius: 16,
          boxShadow: "none",
          fontWeight: 600,
          padding: theme.spacing(1.5, 2),
          ...m3Interactive(theme, 0.99),
          ...rootStyles(ownerState),
        }),
        icon: {
          opacity: 1,
          padding: 0,
          marginRight: theme.spacing(1.5),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        action: { paddingTop: 0, marginRight: 0 },
      },
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          marginBottom: theme.spacing(0.5),
          fontWeight: 800,
        },
      },
    },
  };
}
