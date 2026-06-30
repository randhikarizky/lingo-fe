"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { usePathname } from "next/navigation";

import { consumeNavDirection, M3_MOTION_EASE } from "@/theme/animate/m3-page";
import { FOCUS_HANDOFF_KEY } from "@/theme/animate/practice-session";

type Props = {
  children: React.ReactNode;
};

export default function MainTemplate({ children }: Props) {
  const pathname = usePathname();
  const direction = consumeNavDirection(pathname);
  const [enterMode] = useState<"normal" | "focus">(() => {
    if (typeof window === "undefined") return "normal";
    if (sessionStorage.getItem(FOCUS_HANDOFF_KEY) === "1") {
      sessionStorage.removeItem(FOCUS_HANDOFF_KEY);
      return "focus";
    }
    return "normal";
  });

  const softEnter = enterMode === "focus" && pathname.startsWith("/conversation");

  return (
    <m.div
      key={pathname}
      initial={
        softEnter
          ? { opacity: 0 }
          : { opacity: 0, x: direction * 28, scale: 0.97 }
      }
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        duration: softEnter ? 0.28 : 0.3,
        ease: M3_MOTION_EASE.decelerate,
      }}
      style={{ width: "100%" }}
    >
      {children}
    </m.div>
  );
}
