"use client";

import { useEffect, useState } from "react";
import { useSettingsContext } from "@/theme/settings";

export function useResolvedThemeMode(): "light" | "dark" {
  const { themeMode } = useSettingsContext();
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (themeMode === "light" || themeMode === "dark") {
      setResolved(themeMode);
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const update = () => setResolved(media.matches ? "dark" : "light");
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [themeMode]);

  return resolved;
}
