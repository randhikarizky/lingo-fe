import { alpha } from "@mui/material/styles";

export type ColorSchema =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error";

export const grey = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#6B7280",
  700: "#4B5563",
  800: "#374151",
  900: "#1F2937",
};

export const primary = {
  lighter: "#FFDCC2",
  light: "#FFB380",
  main: "#FA7D19",
  dark: "#D95E00",
  darker: "#A64500",
  contrastText: "#FFFFFF",
  tonalContainer: "#FFEDDF",
  onTonalContainer: "#4D2200",
};

export const secondary = {
  lighter: "#D6E4FF",
  light: "#A3C2FF",
  main: "#4785FF",
  dark: "#1A5CE6",
  darker: "#003BB3",
  contrastText: "#FFFFFF",
  tonalContainer: "#EBF1FF",
  onTonalContainer: "#001B5E",
};

export const info = {
  lighter: "#CAFDF5",
  light: "#61F3F3",
  main: "#00B8D9",
  dark: "#006C9C",
  darker: "#003768",
  contrastText: "#FFFFFF",
};

export const success = {
  lighter: "#D3FCD2",
  light: "#77ED8B",
  main: "#14B862",
  dark: "#0E9A52",
  darker: "#065E49",
  contrastText: "#ffffff",
};

export const warning = {
  lighter: "#FFF5CC",
  light: "#FFD666",
  main: "#FFAB00",
  dark: "#B76E00",
  darker: "#7A4100",
  contrastText: grey[800],
};

export const error = {
  lighter: "#FFE9D5",
  light: "#FFAC82",
  main: "#FF3B30",
  dark: "#B71D18",
  darker: "#7A0916",
  contrastText: "#FFFFFF",
};

export const common = {
  black: "#000000",
  white: "#FFFFFF",
};

export const action = {
  hover: alpha(grey[500], 0.08),
  selected: alpha(grey[500], 0.12),
  disabled: alpha(grey[500], 0.8),
  disabledBackground: alpha(grey[500], 0.16),
  focus: alpha(grey[500], 0.16),
  hoverOpacity: 0.08,
  disabledOpacity: 0.38,
};

const base = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  action,
};

export function palette(mode: "light" | "dark") {
  const light = {
    ...base,
    mode: "light" as const,
    text: {
      primary: "#1C1B1A",
      secondary: "#494745",
      disabled: grey[500],
    },
    background: {
      paper: "#FFFFFF",
      default: "#FFF8F4",
      neutral: "#F5EFEB",
      surfaceContainer: "#F5EFEB",
      surfaceContainerHigh: "#EBE4DF",
    },
    divider: "rgba(28, 27, 26, 0.08)",
  };

  const dark = {
    ...base,
    mode: "dark" as const,
    text: {
      primary: "#F5EFEB",
      secondary: "#D1C9C4",
      disabled: grey[600],
    },
    background: {
      paper: "#262523",
      default: "#1C1B1A",
      neutral: "#33302E",
      surfaceContainer: "#33302E",
      surfaceContainerHigh: "#403D3A",
    },
    divider: "rgba(245, 239, 235, 0.12)",
  };

  return mode === "light" ? light : dark;
}
