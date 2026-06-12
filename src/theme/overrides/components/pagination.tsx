import { alpha, Theme } from "@mui/material/styles";
import { PaginationProps } from "@mui/material/Pagination";
import { paginationItemClasses } from "@mui/material/PaginationItem";
import { m3Interactive } from "../../motion";

const COLORS = ["primary", "secondary", "info", "success", "warning", "error"] as const;

declare module "@mui/material/Pagination" {
  interface PaginationPropsVariantOverrides {
    soft: true;
  }
  interface PaginationPropsColorOverrides {
    info: true;
    success: true;
    warning: true;
    error: true;
  }
}

export function pagination(theme: Theme) {
  const lightMode = theme.palette.mode === "light";

  const rootStyles = (ownerState: PaginationProps) => {
    const defaultColor = ownerState.color === "standard";
    const filledVariant = ownerState.variant === "text";
    const outlinedVariant = ownerState.variant === "outlined";
    const softVariant = ownerState.variant === "soft";

    const defaultStyle = {
      [`& .${paginationItemClasses.root}`]: {
        borderRadius: 100,
        minWidth: 44,
        height: 44,
        fontWeight: 700,
        ...m3Interactive(theme, 0.94),
        ...(outlinedVariant && {
          borderColor: alpha(theme.palette.grey[500], 0.16),
        }),
        [`&.${paginationItemClasses.selected}`]: {
          fontWeight: 800,
          ...(outlinedVariant && { borderColor: "currentColor" }),
          ...(defaultColor && {
            ...(filledVariant && {
              color: theme.palette.primary.contrastText,
              backgroundColor: theme.palette.primary.main,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }),
            ...(softVariant && {
              color: theme.palette.primary.onTonalContainer ?? theme.palette.primary.dark,
              backgroundColor:
                theme.palette.primary.tonalContainer ??
                alpha(theme.palette.primary.main, 0.12),
            }),
          }),
        },
      },
    };

    const colorStyle = COLORS.map((color) => ({
      ...(ownerState.color === color && {
        [`& .${paginationItemClasses.root}`]: {
          [`&.${paginationItemClasses.selected}`]: {
            ...(softVariant && {
              color:
                theme.palette[color].onTonalContainer ??
                theme.palette[color][lightMode ? "dark" : "light"],
              backgroundColor:
                theme.palette[color].tonalContainer ??
                alpha(theme.palette[color].main, 0.12),
              "&:hover": {
                backgroundColor: alpha(theme.palette[color].main, 0.2),
              },
            }),
          },
        },
      }),
    }));

    return [defaultStyle, ...colorStyle];
  };

  return {
    MuiPagination: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: PaginationProps }) => rootStyles(ownerState),
      },
    },
  };
}
