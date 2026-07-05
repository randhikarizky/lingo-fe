"use client";

import { m } from "framer-motion";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { PlanId } from "@/features/subscription/domain/entities/subscription.entity";
import { getPlanLabel } from "@/features/subscription/domain/utils/subscription-access";
import { getAvatarColor, getInitials } from "../../utils/profile-avatar.utils";
import { profileSectionCardSx } from "./profile.tokens";

type Props = {
  name: string;
  email: string;
  plan: PlanId | string;
};

function getPlanBadgeLabel(plan: string) {
  if (plan === "LIFETIME") return "Premium";
  return getPlanLabel(plan);
}

function getPlanBadgeColor(
  plan: string
): "default" | "primary" | "warning" | "secondary" {
  if (plan === "FREE") return "default";
  if (plan === "LIFETIME") return "warning";
  if (plan === "PRO" || plan === "STARTER") return "primary";
  return "secondary";
}

export default function ProfileHeader({ name, email, plan }: Props) {
  const initials = getInitials(name || email);
  const avatarColor = getAvatarColor(email || name);

  return (
    <Card
      component={m.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        ...profileSectionCardSx,
        p: 2.5,
        backgroundImage: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(250,125,25,0.12) 0%, rgba(71,133,255,0.08) 100%)"
            : "linear-gradient(135deg, rgba(250,125,25,0.08) 0%, rgba(71,133,255,0.05) 100%)",
      }}
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: avatarColor,
            fontWeight: 800,
            fontSize: 22,
          }}
        >
          {initials || "?"}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }} noWrap>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {email}
          </Typography>
          <Chip
            component={m.span}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 320 }}
            label={getPlanBadgeLabel(plan)}
            size="small"
            color={getPlanBadgeColor(plan)}
            variant="soft"
            sx={{ mt: 1, fontWeight: 800, letterSpacing: 0.5 }}
          />
        </Box>
      </Stack>
    </Card>
  );
}
