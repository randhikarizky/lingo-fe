import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    neutral: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
  }

  interface PaletteColor {
    lighter: string;
    darker: string;
    tonalContainer?: string;
    onTonalContainer?: string;
  }

  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
    tonalContainer?: string;
    onTonalContainer?: string;
  }

  interface Theme {
    customShadows: {
      z1: string;
      z4: string;
      z8: string;
      z12: string;
      z16: string;
      z20: string;
      z24: string;
      primary: string;
      secondary: string;
      info: string;
      success: string;
      warning: string;
      error: string;
      card: string;
      appBar: string;
      dialog: string;
      dropdown: string;
      bottomNav: string;
      fab: string;
    };
  }

  interface ThemeOptions {
    customShadows?: Theme["customShadows"];
  }
}
