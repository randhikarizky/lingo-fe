"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { UserSubscription } from "../../domain/entities/subscription.entity";
import { formatQuotaUsage, getPlanLabel } from "../../domain/utils/subscription-access";

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
          sx={{ height: 6, borderRadius: 1 }}
        />
      )}
    </Box>
  );
}

export default function UsageCard({ subscription, onUpgrade }: Props) {
  const showUpgrade = subscription.plan === "FREE" || subscription.plan === "STARTER";

  return (
    <Card sx={{ p: 2.5 }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Paket Aktif
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {getPlanLabel(subscription.plan)}
            </Typography>
          </Box>
          <Chip label={subscription.status} size="small" color="primary" variant="soft" />
        </Stack>

        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Sisa kuota hari ini
        </Typography>

        <UsageRow
          label="Speaking (menit)"
          used={subscription.usage.speakingMinutes}
          limit={subscription.limits.speakingMinutesPerDay}
        />
        <UsageRow
          label="AI replies"
          used={subscription.usage.aiReplies}
          limit={subscription.limits.aiRepliesPerDay}
        />
        <UsageRow
          label="Conversation aktif"
          used={subscription.activeConversations}
          limit={subscription.limits.activeConversations}
        />

        {showUpgrade && (
          <Button variant="contained" onClick={onUpgrade}>
            Upgrade Paket
          </Button>
        )}
      </Stack>
    </Card>
  );
}
