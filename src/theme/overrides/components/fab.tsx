import { alpha, Theme } from "@mui/material/styles";
import { FabProps, fabClasses } from "@mui/material/Fab";
import { m3Interactive } from "../../motion";

const COLORS = ["primary", "secondary", "info", "success", "warning", "error"] as const;

declare module "@mui/material/Fab" {
  interface FabPropsVariantOverrides {
    outlined: true;
    outlinedExtended: true;
    soft: true;
    softExtended: true;
  }
}

export function fab(theme: Theme) {
  const lightMode = theme.palette.mode === "light";

  const rootStyles = (ownerState: FabProps) => {
    const defaultColor = ownerState.color === "default";
    const inheritColor = ownerState.color === "inherit";
    const circularVariant = ownerState.variant === "circular";
    const extendedVariant = ownerState.variant === "extended";
    const outlinedVariant = ownerState.variant === "outlined";
    const outlinedExtendedVariant = ownerState.variant === "outlinedExtended";
    const softVariant = ownerState.variant === "soft";
    const softExtendedVariant = ownerState.variant === "softExtended";

    const defaultStyle = {
      boxShadow: "none",
      "&:hover, &:active": {
        boxShadow: "none",
      },
      ...((circularVariant || extendedVariant) && {
        ...(inheritColor && {
          backgroundColor: theme.palette.text.primary,
          color: lightMode ? theme.palette.common.white : theme.palette.grey[800],
          "&:hover": {
            backgroundColor: lightMode ? theme.palette.grey[700] : theme.palette.grey[400],
          },
        }),
      }),
      ...((outlinedVariant || outlinedExtendedVariant) && {
        backgroundColor: "transparent",
        ...((defaultColor || inheritColor) && {
          border: `solid 1.5px ${alpha(theme.palette.grey[500], 0.32)}`,
        }),
        "&:hover": {
          borderColor: "currentColor",
          backgroundColor: theme.palette.action.hover,
        },
      }),
      ...((softVariant || softExtendedVariant) && {
        ...(defaultColor && {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.surfaceContainer,
          "&:hover": {
            backgroundColor: theme.palette.background.surfaceContainerHigh,
          },
        }),
        ...(inheritColor && {
          backgroundColor: alpha(theme.palette.grey[500], 0.08),
          "&:hover": {
            backgroundColor: alpha(theme.palette.grey[500], 0.24),
          },
        }),
      }),
    };

    const colorStyle = COLORS.map((color) => {
      const paletteColor = theme.palette[color];
      const tonalBg = paletteColor.tonalContainer ?? alpha(paletteColor.main, 0.16);

      return {
        ...(ownerState.color === color && {
          ...((circularVariant || extendedVariant) && {
            boxShadow: color === "primary" ? theme.customShadows.fab : "none",
            "&:hover": {
              backgroundColor: paletteColor.dark,
              boxShadow: color === "primary" ? theme.customShadows.fab : "none",
            },
          }),
          ...((outlinedVariant || outlinedExtendedVariant) && {
            color: paletteColor.main,
            border: `solid 1.5px ${alpha(paletteColor.main, 0.48)}`,
            "&:hover": {
              backgroundColor: alpha(paletteColor.main, 0.08),
            },
          }),
          ...((softVariant || softExtendedVariant) && {
            color: paletteColor.onTonalContainer ?? paletteColor[lightMode ? "dark" : "light"],
            backgroundColor: tonalBg,
            "&:hover": {
              backgroundColor: alpha(paletteColor.main, 0.32),
            },
          }),
        }),
      };
    });

    const disabledState = {
      [`&.${fabClasses.disabled}`]: {
        ...((outlinedVariant || outlinedExtendedVariant) && {
          backgroundColor: "transparent",
          border: `solid 1.5px ${theme.palette.action.disabledBackground}`,
        }),
      },
    };

    const size = {
      borderRadius: 16,
      minHeight: 56,
      minWidth: 56,
      ...m3Interactive(theme, 0.92),
      ...((extendedVariant || outlinedExtendedVariant || softExtendedVariant) && {
        width: "auto",
        "& svg": {
          marginRight: theme.spacing(1),
        },
        ...(ownerState.size === "small" && {
          height: 48,
          minHeight: 48,
          borderRadius: 12,
          padding: theme.spacing(0, 2),
        }),
        ...(ownerState.size === "medium" && {
          height: 56,
          minHeight: 56,
          borderRadius: 16,
          padding: theme.spacing(0, 2.5),
        }),
        ...(ownerState.size === "large" && {
          height: 64,
          minHeight: 64,
          borderRadius: 20,
          padding: theme.spacing(0, 3),
        }),
      }),
    };

    return [defaultStyle, ...colorStyle, disabledState, size];
  };

  return {
    MuiFab: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: FabProps }) => rootStyles(ownerState),
      },
    },
  };
}
