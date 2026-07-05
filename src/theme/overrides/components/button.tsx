import { alpha, Theme } from "@mui/material/styles";
import { ButtonProps, buttonClasses } from "@mui/material/Button";
import { m3Interactive } from "../../motion";

const COLORS = ["primary", "secondary", "info", "success", "warning", "error"] as const;

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    soft: true;
  }
}

export function button(theme: Theme) {
  const lightMode = theme.palette.mode === "light";

  const rootStyles = (ownerState: ButtonProps) => {
    const inheritColor = ownerState.color === "inherit";
    const containedVariant = ownerState.variant === "contained";
    const outlinedVariant = ownerState.variant === "outlined";
    const textVariant = ownerState.variant === "text";
    const softVariant = ownerState.variant === "soft";
    const smallSize = ownerState.size === "small";
    const mediumSize = ownerState.size === "medium";
    const largeSize = ownerState.size === "large";

    const defaultStyle = {
      ...(inheritColor && {
        ...(containedVariant && {
          color: lightMode ? theme.palette.common.white : theme.palette.grey[800],
          backgroundColor: lightMode
            ? theme.palette.grey[800]
            : theme.palette.common.white,
          "&:hover": {
            backgroundColor: lightMode
              ? theme.palette.grey[700]
              : theme.palette.grey[400],
          },
        }),
        ...(outlinedVariant && {
          borderColor: alpha(theme.palette.grey[500], 0.32),
          "&:hover": { backgroundColor: theme.palette.action.hover },
        }),
        ...(textVariant && {
          "&:hover": { backgroundColor: theme.palette.action.hover },
        }),
        ...(softVariant && {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.surfaceContainer,
          "&:hover": {
            backgroundColor: theme.palette.background.surfaceContainerHigh,
          },
        }),
      }),
      ...(outlinedVariant && {
        borderWidth: 1.5,
        "&:hover": { borderWidth: 1.5 },
      }),
    };

    const colorStyle = COLORS.map((color) => {
      const paletteColor = theme.palette[color];
      const tonalBg = paletteColor.tonalContainer ?? alpha(paletteColor.main, 0.16);
      const tonalFg =
        paletteColor.onTonalContainer ?? paletteColor[lightMode ? "dark" : "light"];

      return {
        ...(ownerState.color === color && {
          ...(containedVariant && {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
              backgroundColor: paletteColor.dark,
            },
          }),
          ...(softVariant && {
            color: tonalFg,
            backgroundColor: tonalBg,
            "&:hover": {
              backgroundColor: alpha(paletteColor.main, lightMode ? 0.24 : 0.32),
            },
          }),
        }),
      };
    });

    const disabledState = {
      [`&.${buttonClasses.disabled}`]: {
        ...(softVariant && { backgroundColor: theme.palette.action.disabledBackground }),
      },
    };

    const size = {
      ...(smallSize && {
        minHeight: 40,
        height: 40,
        fontSize: 14,
        paddingLeft: 20,
        paddingRight: 20,
      }),
      ...(mediumSize && {
        minHeight: 48,
        height: 48,
        fontSize: 16,
        paddingLeft: 24,
        paddingRight: 24,
      }),
      ...(largeSize && {
        minHeight: 56,
        height: 56,
        fontSize: 17,
        paddingLeft: 32,
        paddingRight: 32,
      }),
    };

    return [defaultStyle, ...colorStyle, disabledState, size];
  };

  return {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: ButtonProps }) => ({
          borderRadius: 100,
          textTransform: "none",
          fontWeight: 800,
          ...m3Interactive(theme, 0.96),
          ...rootStyles(ownerState),
        }),
      },
    },
  };
}
