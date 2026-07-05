"use client";

import { useSyncExternalStore } from "react";
import { useSettingsContext } from "@/theme/settings";

function subscribeSystemTheme(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerTheme(): "light" | "dark" {
  return "light";
}

export function useResolvedThemeMode(): "light" | "dark" {
  const { themeMode } = useSettingsContext();
  const systemTheme = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemTheme,
    getServerTheme
  );

  if (themeMode === "light" || themeMode === "dark") {
    return themeMode;
  }

  return systemTheme;
}
