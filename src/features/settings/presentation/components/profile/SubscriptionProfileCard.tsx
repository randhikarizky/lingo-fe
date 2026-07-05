"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { UserSubscription } from "@/features/subscription/domain/entities/subscription.entity";
import {
  formatQuotaUsage,
  getPlanLabel,
} from "@/features/subscription/domain/utils/subscription-access";
import { PROFILE_RADIUS, profileSectionCardSx } from "./profile.tokens";

type Props = {
  subscription: UserSubscription;
  onManagePlan: () => void;
  onUpgrade: () => void;
};

function UsageRow({
  label,
  used,
  limit,
  remaining,
}: {
  label: string;
  used: number;
  limit: number | null;
  remaining: number | null;
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
          {remaining !== null ? ` · sisa ${remaining}` : ""}
        </Typography>
      </Stack>
      {limit !== null && (
        <LinearProgress
          variant="determinate"
          value={progress}
          color={progress >= 100 ? "error" : "primary"}
          sx={{ height: 6, borderRadius: `${PROFILE_RADIUS.track ?? 999}px` }}
        />
      )}
    </Box>
  );
}

function getPlanBenefits(subscription: UserSubscription) {
  const benefits: string[] = [];

  if (subscription.features.allScenarios) {
    benefits.push("Semua skenario latihan");
  } else {
    benefits.push("Skenario terbatas");
  }

  if (subscription.features.allTutors) {
    benefits.push("Semua tutor AI");
  } else {
    benefits.push("Tutor terbatas");
  }

  if (subscription.features.sessionSummary) {
    benefits.push("Ringkasan sesi lengkap");
  }

  if (subscription.features.priorityProcessing) {
    benefits.push("Prioritas pemrosesan AI");
  }

  return benefits;
}

export default function SubscriptionProfileCard({
  subscription,
  onManagePlan,
  onUpgrade,
}: Props) {
  const showUpgrade = subscription.plan === "FREE" || subscription.plan === "STARTER";
  const benefits = getPlanBenefits(subscription);

  return (
    <Card sx={{ ...profileSectionCardSx, p: 2 }}>
      <Stack
        direction="row"
        sx={{ alignItems: "flex-start", justifyContent: "space-between", mb: 1.5 }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Langganan
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {getPlanLabel(subscription.plan)}
          </Typography>
        </Box>
        <Chip
          label={getPlanLabel(subscription.plan)}
          size="small"
          color="primary"
          variant="soft"
          sx={{ fontWeight: 800 }}
        />
      </Stack>

      <Box
        sx={{
          p: 1.25,
          mb: 1.5,
          borderRadius: `${PROFILE_RADIUS.panel}px`,
          bgcolor: "background.surfaceContainerHigh",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 700, display: "block", mb: 0.75 }}
        >
          Manfaat paket
        </Typography>
        <Stack spacing={0.35}>
          {benefits.map((benefit) => (
            <Typography key={benefit} variant="body2" color="text.secondary">
              · {benefit}
            </Typography>
          ))}
        </Stack>
      </Box>

      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
        Sisa kuota
      </Typography>

      <Stack spacing={1.25} sx={{ mb: 2 }}>
        <UsageRow
          label="Speaking (menit)"
          used={subscription.usage.speakingMinutes}
          limit={subscription.limits.speakingMinutesPerDay}
          remaining={subscription.remaining.speakingMinutes}
        />
        <UsageRow
          label="Balasan AI"
          used={subscription.usage.aiReplies}
          limit={subscription.limits.aiRepliesPerDay}
          remaining={subscription.remaining.aiReplies}
        />
        <UsageRow
          label="Conversation aktif"
          used={subscription.activeConversations}
          limit={subscription.limits.activeConversations}
          remaining={subscription.remaining.activeConversations}
        />
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button variant="outlined" fullWidth onClick={onManagePlan}>
          Kelola Paket
        </Button>
        {showUpgrade && (
          <Button variant="contained" fullWidth onClick={onUpgrade}>
            Upgrade
          </Button>
        )}
      </Stack>
    </Card>
  );
}
