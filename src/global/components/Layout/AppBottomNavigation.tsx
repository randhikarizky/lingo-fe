"use client";

import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import { alpha, useTheme } from "@mui/material/styles";
import { usePathname, useRouter } from "next/navigation";

import { useGetMe } from "@/features/auth/presentation/controller/auth.controller";
import {
  getAvatarColor,
  getInitials,
} from "@/features/settings/presentation/utils/profile-avatar.utils";
import { M3_DURATION, M3_EASING } from "@/theme/motion";
import { useActiveSessionNav } from "@/features/dashboard/presentation/hooks/useActiveSessionNav";

type NavItem = {
  id: string;
  label: string;
  href: string;
  match: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Beranda",
    href: "/dashboard",
    match: (pathname) => pathname.startsWith("/dashboard"),
  },
  {
    id: "mission",
    label: "Misi",
    href: "/practice",
    match: (pathname) =>
      pathname.startsWith("/practice") || pathname.startsWith("/conversation"),
  },
  {
    id: "profile",
    label: "Profil",
    href: "/settings",
    match: (pathname) => pathname.startsWith("/settings"),
  },
];

function MissionProgressRing({ progress }: { progress: number }) {
  const theme = useTheme();
  const size = 28;
  const stroke = 2.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <Box sx={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={alpha(theme.palette.primary.main, 0.2)}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <FlagRoundedIcon sx={{ fontSize: 16, color: "inherit" }} />
    </Box>
  );
}

export default function AppBottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const { data: user } = useGetMe();
  const { activeConversation, progress, hasIncompleteMission } = useActiveSessionNav();

  const missionHref = activeConversation
    ? `/conversation?id=${activeConversation.id}`
    : "/practice";

  const initials = getInitials(user?.name || user?.email || "U");
  const avatarColor = getAvatarColor(user?.email || user?.name || "user");

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
        height: 80,
      }}
      elevation={0}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          height: "100%",
          px: 1,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const selected = item.match(pathname);
          const href = item.id === "mission" ? missionHref : item.href;
          const label =
            item.id === "mission" && hasIncompleteMission ? "Lanjutkan" : item.label;

          const icon =
            item.id === "home" ? (
              <HomeRoundedIcon sx={{ fontSize: 22 }} />
            ) : item.id === "mission" ? (
              hasIncompleteMission ? (
                <MissionProgressRing progress={progress} />
              ) : (
                <FlagRoundedIcon sx={{ fontSize: 22 }} />
              )
            ) : (
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  bgcolor: avatarColor,
                }}
              >
                {initials || "?"}
              </Avatar>
            );

          const wrappedIcon =
            item.id === "mission" && hasIncompleteMission ? (
              <Badge variant="dot" color="error" overlap="circular">
                {icon}
              </Badge>
            ) : (
              icon
            );

          return (
            <Box
              key={item.id}
              component="button"
              type="button"
              onClick={() => {
                if (selected && item.id !== "mission") return;
                router.push(href);
              }}
              sx={{
                flex: 1,
                border: "none",
                bgcolor: "transparent",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                py: 0.75,
                color: selected ? "primary.main" : "text.secondary",
                transition: `color ${M3_DURATION.medium}ms ${M3_EASING.emphasizedDecelerate}, transform ${M3_DURATION.medium}ms ${M3_EASING.expressive}`,
                transform: selected ? "scale(1.02)" : "scale(1)",
                "&:focus-visible": {
                  outline: `2px solid ${theme.palette.primary.main}`,
                  outlineOffset: 2,
                  borderRadius: 2,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: selected ? "primary.contrastText" : "inherit",
                  bgcolor: selected ? "primary.main" : "transparent",
                  borderRadius: 100,
                  px: selected ? 2.75 : 1.5,
                  py: 0.75,
                  transition: `background-color ${M3_DURATION.medium}ms ${M3_EASING.emphasizedDecelerate}, padding ${M3_DURATION.medium}ms ${M3_EASING.expressive}`,
                }}
              >
                {wrappedIcon}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: selected ? 800 : 600,
                  fontSize: "0.75rem",
                  lineHeight: 1,
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
