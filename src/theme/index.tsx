"use client";

import { useMemo } from "react";
import merge from "lodash/merge";

import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

import { palette } from "./palette";
import { shadows } from "./shadows";
import { typography } from "./typography";
import RTL from "./options/right-to-left";
import { customShadows } from "./custom-shadows";
import { componentsOverrides } from "./overrides";
import { createContrast } from "./options/contrast";
import NextAppDirEmotionCacheProvider from "./next-emotion-cache";
import { useSettingsContext } from "./settings";
import { useResolvedThemeMode } from "@/global/hooks/useResolvedThemeMode";
import Snackbar from "@/global/components/Snackbar/Snackbar";
import { M3_DURATION, M3_EASING } from "./motion";

const M3_SHAPE = {
  borderRadius: 24,
  buttonBorderRadius: 100,
  dialogBorderRadius: 28,
} as const;

type Props = {
  children: React.ReactNode;
};

export default function ThemeConfig({ children }: Props) {
  const settings = useSettingsContext();
  const mode = useResolvedThemeMode();
  const contrast = createContrast(settings.themeContrast, mode);

  const memoizedValue = useMemo(
    () => ({
      palette: {
        ...palette(mode),
        ...contrast.palette,
      },
      customShadows: customShadows(mode),
      direction: settings.themeDirection,
      shadows: shadows(mode),
      shape: { borderRadius: M3_SHAPE.borderRadius },
      typography,
      transitions: {
        easing: {
          easeInOut: M3_EASING.standard,
          easeOut: M3_EASING.emphasizedDecelerate,
          easeIn: M3_EASING.emphasizedAccelerate,
          sharp: M3_EASING.standard,
        },
        duration: {
          shortest: M3_DURATION.short,
          shorter: M3_DURATION.short,
          short: M3_DURATION.medium,
          standard: M3_DURATION.medium,
          complex: M3_DURATION.long,
          enteringScreen: M3_DURATION.enter,
          leavingScreen: M3_DURATION.exit,
        },
      },
    }),
    [mode, settings.themeDirection, contrast.palette]
  );

  const theme = createTheme(memoizedValue as ThemeOptions);
  theme.components = merge(componentsOverrides(theme), contrast.components);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
      <MuiThemeProvider theme={theme}>
        <RTL themeDirection={settings.themeDirection}>
          <Snackbar>
            <CssBaseline />
            {children}
          </Snackbar>
        </RTL>
      </MuiThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
