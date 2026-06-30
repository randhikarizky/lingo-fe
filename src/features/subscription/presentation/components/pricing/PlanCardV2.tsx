"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";

import type { PlanId, PublicPlan } from "../../../domain/entities/subscription.entity";
import {
  PLAN_THEMES,
  canUpgradeToPlan,
  getPlanBenefitTagline,
  getPlanHighlights,
  getPlanDisplayLabel,
} from "../../utils/pricing.utils";
import FeatureChecklist from "./FeatureChecklist";
import { PRICING_RADIUS, pricingCtaSx } from "./pricing.tokens";

type Props = {
  plan: PublicPlan;
  currentPlan: PlanId;
  loading?: boolean;
  selected?: boolean;
  onSelect: (planId: Exclude<PlanId, "FREE">) => void;
  onHighlight?: (planId: PlanId) => void;
};

export default function PlanCardV2({
  plan,
  currentPlan,
  loading,
  selected,
  onSelect,
  onHighlight,
}: Props) {
  const isCurrent = plan.id === currentPlan;
  const canUpgrade = canUpgradeToPlan(currentPlan, plan.id);
  const isFree = plan.id === "FREE";
  const isPro = plan.id === "PRO";
  const proTheme = PLAN_THEMES.PRO;

  return (
    <Card
      onClick={() => onHighlight?.(plan.id)}
      sx={{
        p: 2.25,
        height: "100%",
        position: "relative",
        borderRadius: `${PRICING_RADIUS.panel}px`,
        cursor: onHighlight ? "pointer" : "default",
        border: "1px solid",
        borderColor: selected
          ? "primary.main"
          : isCurrent
            ? "primary.outline"
            : "divider",
        bgcolor: isPro ? alpha("#1c1c24", 0.6) : "background.paper",
        background: isPro ? proTheme.bg : undefined,
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        transform: selected ? "scale(1.02)" : "scale(1)",
        boxShadow: selected ? 4 : isPro ? "0 8px 32px rgba(0,0,0,0.3)" : 0,
        "&:hover": onHighlight
          ? {
              transform: selected ? "scale(1.02)" : "translateY(-3px)",
              boxShadow: (theme) => theme.shadows[selected ? 4 : 3],
            }
          : undefined,
      }}
    >
      <Stack spacing={1.5} sx={{ height: "100%" }}>
        <Stack direction="row" sx={{ alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              color: isPro ? proTheme.text : "text.primary",
            }}
          >
            {getPlanDisplayLabel(plan.id)}
          </Typography>
          {isCurrent && (
            <Chip
              label="Paket Saat Ini"
              size="small"
              sx={{ fontWeight: 800, bgcolor: "primary.main", color: "primary.contrastText" }}
            />
          )}
          {isPro && !isCurrent && (
            <Chip
              label="Premium"
              size="small"
              sx={{
                fontWeight: 800,
                bgcolor: proTheme.accent,
                color: "#1a1240",
              }}
            />
          )}
        </Stack>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 900,
            color: isPro ? proTheme.accent : "primary.main",
          }}
        >
          {plan.priceLabel}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: isPro ? proTheme.textMuted : "text.secondary",
            lineHeight: 1.45,
          }}
        >
          {getPlanBenefitTagline(plan.id)}
        </Typography>

        <Box sx={{ flex: 1, color: isPro ? proTheme.text : "inherit" }}>
          <FeatureChecklist
            items={getPlanHighlights(plan)}
            accent={isPro ? proTheme.accent : undefined}
            dense
          />
        </Box>

        {isFree ? (
          <Button variant="outlined" disabled fullWidth sx={{ fontWeight: 700, minHeight: 44 }}>
            Titik awalmu
          </Button>
        ) : canUpgrade ? (
          <Button
            variant={selected ? "contained" : "outlined"}
            fullWidth
            disabled={loading}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(plan.id as Exclude<PlanId, "FREE">);
            }}
            sx={{
              fontWeight: 700,
              minHeight: 44,
              ...(selected ? pricingCtaSx : {}),
            }}
          >
            Pilih {getPlanDisplayLabel(plan.id)}
          </Button>
        ) : (
          <Button variant="outlined" disabled fullWidth sx={{ fontWeight: 700, minHeight: 44 }}>
            {isCurrent ? "Paket Saat Ini" : "Sudah Termasuk"}
          </Button>
        )}
      </Stack>
    </Card>
  );
}
