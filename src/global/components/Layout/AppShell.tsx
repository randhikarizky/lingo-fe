"use client";

import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";

import AppBottomNavigation from "./AppBottomNavigation";

type Props = {
  children: React.ReactNode;
};

export default function AppShell({ children }: Props) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 480,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          pb: "72px",
        }}
      >
        <Box sx={{ flex: 1, px: 2, py: 2 }}>{children}</Box>
        <AppBottomNavigation />
      </Box>
    </Box>
  );
}
