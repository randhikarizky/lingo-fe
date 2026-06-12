import { alpha, Theme } from "@mui/material/styles";
import { svgIconClasses } from "@mui/material/SvgIcon";
import { autocompleteClasses } from "@mui/material/Autocomplete";

import { paper, menuItem } from "../../css";

export function autocomplete(theme: Theme) {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          [`& span.${autocompleteClasses.tag}`]: {
            ...theme.typography.subtitle2,
            height: 28,
            minWidth: 28,
            lineHeight: "28px",
            textAlign: "center",
            padding: theme.spacing(0, 1),
            color: theme.palette.primary.onTonalContainer ?? theme.palette.primary.dark,
            borderRadius: 8,
            fontWeight: 700,
            backgroundColor:
              theme.palette.primary.tonalContainer ??
              alpha(theme.palette.primary.main, 0.16),
          },
        },
        paper: {
          ...paper({ theme, dropdown: true }),
        },
        listbox: {
          padding: theme.spacing(0.5),
          [`& .${autocompleteClasses.option}`]: {
            ...menuItem(theme),
          },
        },
        endAdornment: {
          [`& .${svgIconClasses.root}`]: {
            width: 20,
            height: 20,
          },
        },
      },
    },
  };
}
