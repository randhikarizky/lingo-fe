import { Theme } from "@mui/material/styles";
import { ButtonGroupProps, buttonGroupClasses } from "@mui/material/ButtonGroup";

const COLORS = ["primary", "secondary", "info", "success", "warning", "error"] as const;

declare module "@mui/material/ButtonGroup" {
  interface ButtonGroupPropsVariantOverrides {
    soft: true;
  }
}

export function buttonGroup(theme: Theme) {
  const rootStyles = (ownerState: ButtonGroupProps) => {
    const inheritColor = ownerState.color === "inherit";
    const containedVariant = ownerState.variant === "contained";
    const outlinedVariant = ownerState.variant === "outlined";
    const textVariant = ownerState.variant === "text";
    const softVariant = ownerState.variant === "soft";
    const horizontalOrientation = ownerState.orientation === "horizontal";
    const verticalOrientation = ownerState.orientation === "vertical";

    const defaultStyle = {
      borderRadius: 100,
      boxShadow: "none",
      backgroundColor: theme.palette.background.surfaceContainer,
      padding: 4,
      [`& .${buttonGroupClasses.grouped}`]: {
        borderRadius: "100px !important",
        border: "none",
        minHeight: 40,
        "&:not(:last-of-type)": {
          ...(!outlinedVariant && {
            borderStyle: "solid",
            ...(inheritColor && {
              borderColor: "transparent",
            }),
            ...(horizontalOrientation && { borderWidth: "0px" }),
            ...(verticalOrientation && { borderWidth: "0px" }),
          }),
        },
      },
    };

    const colorStyle = COLORS.map((color) => ({
      [`& .${buttonGroupClasses.grouped}`]: {
        "&:not(:last-of-type)": {
          ...(!outlinedVariant && {
            ...(ownerState.color === color && {
              ...(containedVariant && { borderColor: "transparent" }),
              ...(textVariant && { borderColor: "transparent" }),
              ...(softVariant && { borderColor: "transparent" }),
            }),
          }),
        },
      },
    }));

    const disabledState = {
      [`& .${buttonGroupClasses.grouped}`]: {
        [`&.${buttonGroupClasses.disabled}`]: {
          "&:not(:last-of-type)": {
            borderColor: "transparent",
          },
        },
      },
    };

    return [defaultStyle, ...colorStyle, disabledState];
  };

  return {
    MuiButtonGroup: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: ButtonGroupProps }) => rootStyles(ownerState),
      },
    },
  };
}
