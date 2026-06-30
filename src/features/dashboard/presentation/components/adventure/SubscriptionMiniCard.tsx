"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

import type { UserSubscription } from "@/features/subscription/domain/entities/subscription.entity";
import { formatQuotaUsage, getPlanLabel } from "@/features/subscription/domain/utils/subscription-access";
import { DASHBOARD_RADIUS } from "./dashboard.tokens";

type Props = {
  subscription: UserSubscription;
  onUpgrade: () => void;
};

function UsageRow({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number | null;
}) {
  const progress =
    limit === null || limit <= 0 ? 0 : Math.min(100, Math.round((used / limit) * 100));

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          {formatQuotaUsage(used, limit)}
        </Typography>
      </Stack>
      {limit !== null && (
        <LinearProgress
          variant="determinate"
          value={progress}
          color={progress >= 100 ? "error" : "primary"}
          sx={{ height: 5, borderRadius: 1 }}
        />
      )}
    </Box>
  );
}

export default function SubscriptionMiniCard({ subscription, onUpgrade }: Props) {
  const [expanded, setExpanded] = useState(false);
  const showUpgrade = subscription.plan === "FREE" || subscription.plan === "STARTER";

  const speakingRemaining =
    subscription.limits.speakingMinutesPerDay === null
      ? "Tanpa batas"
      : `${Math.max(0, subscription.limits.speakingMinutesPerDay - subscription.usage.speakingMinutes)} mnt`;

  const repliesRemaining =
    subscription.limits.aiRepliesPerDay === null
      ? "Tanpa batas"
      : `${Math.max(0, subscription.limits.aiRepliesPerDay - subscription.usage.aiReplies)} tersisa`;

  return (
    <Card sx={{ p: 2, borderRadius: `${DASHBOARD_RADIUS.panel}px` }}>
      <Stack spacing={1.5}>
        <Stack direction="row" sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Paket Saat Ini
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
              {getPlanLabel(subscription.plan)}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <Chip label={subscription.status} size="small" color="primary" variant="soft" />
            <IconButton
              size="small"
              aria-expanded={expanded}
              aria-label="Tampilkan detail kuota"
              onClick={() => setExpanded((prev) => !prev)}
              sx={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <ExpandMoreRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Sisa speaking
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>
              {speakingRemaining}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Sisa balasan AI
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>
              {repliesRemaining}
            </Typography>
          </Box>
        </Stack>

        <Collapse in={expanded}>
          <Stack spacing={1.25} sx={{ pt: 0.5 }}>
            <UsageRow
              label="Speaking (menit)"
              used={subscription.usage.speakingMinutes}
              limit={subscription.limits.speakingMinutesPerDay}
            />
            <UsageRow
              label="Balasan AI"
              used={subscription.usage.aiReplies}
              limit={subscription.limits.aiRepliesPerDay}
            />
            <UsageRow
              label="Percakapan aktif"
              used={subscription.activeConversations}
              limit={subscription.limits.activeConversations}
            />
          </Stack>
        </Collapse>

        {showUpgrade && (
          <Button variant="outlined" size="small" onClick={onUpgrade} sx={{ fontWeight: 700 }}>
            Upgrade Paket
          </Button>
        )}
      </Stack>
    </Card>
  );
}
