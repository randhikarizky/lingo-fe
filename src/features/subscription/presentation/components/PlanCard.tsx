"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { PlanId, PublicPlan } from "../../domain/entities/subscription.entity";
import { formatQuotaLimit } from "../../domain/utils/subscription-access";

type Props = {
  plan: PublicPlan;
  currentPlan?: PlanId;
  loading?: boolean;
  onSelect: (planId: Exclude<PlanId, "FREE">) => void;
};

const PLAN_RANK: Record<PlanId, number> = {
  FREE: 0,
  STARTER: 1,
  PRO: 2,
  LIFETIME: 3,
};

export default function PlanCard({ plan, currentPlan = "FREE", loading, onSelect }: Props) {
  const isCurrent = plan.id === currentPlan;
  const isDowngrade = PLAN_RANK[plan.id] <= PLAN_RANK[currentPlan];
  const canUpgrade = plan.id !== "FREE" && !isCurrent && !isDowngrade;

  return (
    <Card
      sx={{
        p: 2.5,
        height: "100%",
        borderWidth: isCurrent ? 2 : 1,
        borderStyle: "solid",
        borderColor: isCurrent ? "primary.main" : "divider",
      }}
    >
      <Stack spacing={1.5} sx={{ height: "100%" }}>
        <Stack direction="row" sx={{ alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {plan.label}
          </Typography>
          {plan.badge && <Chip label={plan.badge} size="small" color="secondary" />}
          {isCurrent && <Chip label="Paket Aktif" size="small" color="primary" />}
        </Stack>

        <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main" }}>
          {plan.priceLabel}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {plan.description}
        </Typography>

        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            Limit harian
          </Typography>
          <Typography variant="body2">
            Speaking: {formatQuotaLimit(plan.limits.speakingMinutesPerDay)} menit
          </Typography>
          <Typography variant="body2">
            AI replies: {formatQuotaLimit(plan.limits.aiRepliesPerDay)}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Conversation aktif: {formatQuotaLimit(plan.limits.activeConversations)}
          </Typography>

          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            Fitur
          </Typography>
          <Typography variant="body2">
            {plan.features.allScenarios ? "Semua skenario" : "3 skenario dasar"}
          </Typography>
          <Typography variant="body2">
            {plan.features.allTutors ? "Semua tutor" : "Tutor dasar"}
          </Typography>
          {plan.features.priorityProcessing && (
            <Typography variant="body2">Priority processing</Typography>
          )}
        </Box>

        {plan.id === "FREE" ? (
          <Button variant="outlined" disabled fullWidth>
            Paket Default
          </Button>
        ) : canUpgrade ? (
          <Button
            variant="contained"
            fullWidth
            disabled={loading}
            onClick={() => onSelect(plan.id as Exclude<PlanId, "FREE">)}
          >
            Pilih {plan.label}
          </Button>
        ) : (
          <Button variant="outlined" disabled fullWidth>
            {isCurrent ? "Sedang Digunakan" : "Sudah Termasuk"}
          </Button>
        )}
      </Stack>
    </Card>
  );
}
