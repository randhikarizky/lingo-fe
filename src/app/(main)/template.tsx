"use client";

import { m } from "framer-motion";
import { usePathname } from "next/navigation";

import { consumeNavDirection, M3_MOTION_EASE } from "@/theme/animate/m3-page";

type Props = {
  children: React.ReactNode;
};

export default function MainTemplate({ children }: Props) {
  const pathname = usePathname();
  const direction = consumeNavDirection(pathname);

  return (
    <m.div
      key={pathname}
      initial={{ opacity: 0, x: direction * 28, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: M3_MOTION_EASE.decelerate }}
      style={{ width: "100%" }}
    >
      {children}
    </m.div>
  );
}
