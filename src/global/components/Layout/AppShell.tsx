"use client";

import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";

import AppBottomNavigation from "./AppBottomNavigation";
import AuthGuard from "@/global/components/Auth/AuthGuard";
import { APP_BOTTOM_NAV_HEIGHT } from "@/global/constants/layout";

type Props = {
  children: React.ReactNode;
};

export default function AppShell({ children }: Props) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login";
  const isConversationSession = pathname.startsWith("/conversation");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
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
            pb: isConversationSession ? 0 : `${APP_BOTTOM_NAV_HEIGHT}px`,
          }}
        >
          <Box sx={{ flex: 1, px: 2, py: isConversationSession ? 0 : 2 }}>{children}</Box>
          {!isConversationSession && <AppBottomNavigation />}
        </Box>
      </Box>
    </AuthGuard>
  );
}
