import { alpha, Theme } from "@mui/material/styles";
import { inputBaseClasses } from "@mui/material/InputBase";
import { inputLabelClasses } from "@mui/material/InputLabel";
import { filledInputClasses } from "@mui/material/FilledInput";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";

export function textField(theme: Theme) {
  const color = {
    focused: theme.palette.primary.main,
    active: theme.palette.text.secondary,
    placeholder: theme.palette.text.disabled,
  };

  const font = {
    label: theme.typography.body1,
    value: theme.typography.body2,
  };

  return {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: theme.spacing(1),
          fontWeight: 500,
        },
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: {
          ...font.value,
          color: color.placeholder,
          [`&.${inputLabelClasses.shrink}`]: {
            ...font.label,
            fontWeight: 700,
            color: color.active,
            [`&.${inputLabelClasses.focused}`]: {
              color: color.focused,
            },
            [`&.${inputLabelClasses.error}`]: {
              color: theme.palette.error.main,
            },
            [`&.${inputLabelClasses.disabled}`]: {
              color: theme.palette.text.disabled,
            },
            [`&.${inputLabelClasses.filled}`]: {
              transform: "translate(16px, 8px) scale(0.75)",
            },
          },
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          minHeight: 48,
          [`&.${inputBaseClasses.disabled}`]: {
            "& svg": {
              color: theme.palette.text.disabled,
            },
          },
        },
        input: {
          ...font.value,
          padding: "14px 16px",
          "&::placeholder": {
            opacity: 1,
            color: color.placeholder,
          },
        },
        inputSizeSmall: {
          padding: "10px 14px",
        },
      },
    },

    MuiInput: {
      styleOverrides: {
        underline: {
          "&:before": {
            borderBottomColor: alpha(theme.palette.grey[500], 0.32),
          },
          "&:after": {
            borderBottomColor: color.focused,
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          minHeight: 48,
          backgroundColor: theme.palette.background.paper,
          [`&.${outlinedInputClasses.focused}`]: {
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: color.focused,
              borderWidth: 2,
            },
          },
          [`&.${outlinedInputClasses.error}`]: {
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: theme.palette.error.main,
            },
          },
          [`&.${outlinedInputClasses.disabled}`]: {
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: theme.palette.action.disabledBackground,
            },
          },
        },
        input: {
          padding: "14px 16px",
        },
        inputSizeSmall: {
          padding: "10px 14px",
          minHeight: 40,
        },
        notchedOutline: {
          borderColor: alpha(theme.palette.grey[500], 0.2),
          transition: theme.transitions.create(["border-color", "border-width"], {
            duration: theme.transitions.duration.shorter,
          }),
        },
      },
    },

    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: "16px 16px 0 0",
          minHeight: 48,
          backgroundColor: theme.palette.background.surfaceContainer,
          "&:hover": {
            backgroundColor: theme.palette.background.surfaceContainerHigh,
          },
          [`&.${filledInputClasses.focused}`]: {
            backgroundColor: theme.palette.background.surfaceContainerHigh,
          },
          [`&.${filledInputClasses.error}`]: {
            backgroundColor: alpha(theme.palette.error.main, 0.08),
            [`&.${filledInputClasses.focused}`]: {
              backgroundColor: alpha(theme.palette.error.main, 0.16),
            },
          },
          [`&.${filledInputClasses.disabled}`]: {
            backgroundColor: theme.palette.action.disabledBackground,
          },
        },
        input: {
          padding: "16px 16px 8px",
        },
      },
    },
  };
}
