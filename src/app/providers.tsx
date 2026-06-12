"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import ThemeConfig from "@/theme";
import { MotionLazy } from "@/theme/animate/motion-lazy";
import { SettingsProvider } from "@/theme/settings";
import type { SettingsValueProps } from "@/theme/settings/types";

const defaultSettings: SettingsValueProps = {
  themeStretch: false,
  themeMode: "system",
  themeDirection: "ltr",
  themeContrast: "default",
  themeLayout: "mobile-first",
  themeColorPresets: "orange",
};

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SettingsProvider defaultSettings={defaultSettings}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeConfig>
          <MotionLazy>
            <QueryClientProvider client={queryClient}>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </MotionLazy>
        </ThemeConfig>
      </LocalizationProvider>
    </SettingsProvider>
  );
}
