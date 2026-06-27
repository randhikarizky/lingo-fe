"use client";

import { usePathname, useRouter } from "next/navigation";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

const NAV_ITEMS = [
  { label: "Beranda", href: "/dashboard", icon: HomeRoundedIcon },
  { label: "Latihan", href: "/practice", icon: ChatRoundedIcon },
  { label: "Pengaturan", href: "/settings", icon: SettingsRoundedIcon },
];

export default function AppBottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const currentIndex = (() => {
    if (pathname.startsWith("/practice") || pathname.startsWith("/conversation")) {
      return 1;
    }

    const index = NAV_ITEMS.findIndex((item) => pathname.startsWith(item.href));
    return index === -1 ? 0 : index;
  })();

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 480,
        zIndex: 1100,
        borderRadius: 0,
        boxShadow: "none",
        bgcolor: "background.default",
      }}
      elevation={0}
    >
      <BottomNavigation
        showLabels
        value={currentIndex}
        onChange={(_, newValue) => {
          const href = NAV_ITEMS[newValue].href;
          if (pathname.startsWith(href)) return;
          router.push(href);
        }}
      >
        {NAV_ITEMS.map((item) => (
          <BottomNavigationAction
            key={item.href}
            label={item.label}
            icon={<item.icon />}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
