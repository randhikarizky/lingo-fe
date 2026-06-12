import { Theme, alpha } from "@mui/material/styles";
import { ToggleButtonProps, toggleButtonClasses } from "@mui/material/ToggleButton";
import { m3Interactive, m3Transition } from "../../motion";

const COLORS = ["primary", "secondary", "info", "success", "warning", "error"] as const;

export function toggleButton(theme: Theme) {
  const rootStyles = (ownerState: ToggleButtonProps) => {
    const defaultStyle = {
      borderRadius: 100,
      border: "none",
      minHeight: 44,
      minWidth: 44,
      fontWeight: 700,
      textTransform: "none" as const,
      color: theme.palette.text.secondary,
      ...m3Interactive(theme, 0.96),
      [`&.${toggleButtonClasses.selected}`]: {
        borderColor: "transparent",
        boxShadow: "none",
        color: theme.palette.primary.onTonalContainer ?? theme.palette.primary.dark,
        fontWeight: 800,
        backgroundColor:
          theme.palette.primary.tonalContainer ??
          alpha(theme.palette.primary.main, 0.14),
      },
    };

    const colorStyle = COLORS.map((color) => ({
      ...(ownerState.color === color && {
        "&:hover": {
          backgroundColor: alpha(theme.palette[color].main, 0.08),
        },
        [`&.${toggleButtonClasses.selected}`]: {
          color:
            theme.palette[color].onTonalContainer ??
            theme.palette[color].dark,
          backgroundColor:
            theme.palette[color].tonalContainer ??
            alpha(theme.palette[color].main, 0.14),
        },
      }),
    }));

    const disabledState = {
      [`&.${toggleButtonClasses.disabled}`]: {
        [`&.${toggleButtonClasses.selected}`]: {
          color: theme.palette.action.disabled,
          backgroundColor: theme.palette.action.selected,
        },
      },
    };

    return [defaultStyle, ...colorStyle, disabledState];
  };

  return {
    MuiToggleButton: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: ToggleButtonProps }) => rootStyles(ownerState),
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          backgroundColor: theme.palette.background.surfaceContainer,
          border: "none",
          boxShadow: "none",
          padding: 4,
          gap: 4,
        },
        grouped: {
          margin: 0,
          borderRadius: "100px !important",
          border: "none",
          transition: m3Transition(theme, ["background-color", "color"]),
          [`&.${toggleButtonClasses.selected}`]: {
            boxShadow: "none",
          },
          "&:not(:first-of-type), &:not(:last-of-type)": {
            borderRadius: "100px !important",
            borderColor: "transparent",
          },
        },
      },
    },
  };
}
