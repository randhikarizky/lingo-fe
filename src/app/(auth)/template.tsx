"use client";

import { m } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

export default function AuthTemplate({ children }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.05, 0.7, 0.1, 1] }}
      style={{ width: "100%", minHeight: "100vh" }}
    >
      {children}
    </m.div>
  );
}
