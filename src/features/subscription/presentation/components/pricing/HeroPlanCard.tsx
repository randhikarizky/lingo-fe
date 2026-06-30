"use client";

import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { PlanId, PublicPlan } from "../../../domain/entities/subscription.entity";
import {
  LIFETIME_VALUE_POINTS,
  PLAN_THEMES,
  canUpgradeToPlan,
  getHeroBadge,
  getHeroHighlights,
  getPlanBenefitTagline,
  getPlanDisplayLabel,
} from "../../utils/pricing.utils";
import FeatureChecklist from "./FeatureChecklist";
import SavingsBadge from "./SavingsBadge";
import { PRICING_RADIUS, pricingCtaSx } from "./pricing.tokens";
import { M3_MOTION_EASE } from "@/theme/animate/m3-page";

type Props = {
  plan: PublicPlan;
  currentPlan: PlanId;
  loading?: boolean;
  selected?: boolean;
  onSelect: (planId: Exclude<PlanId, "FREE">) => void;
};

export default function HeroPlanCard({
  plan,
  currentPlan,
  loading,
  selected,
  onSelect,
}: Props) {
  const theme = PLAN_THEMES[plan.id];
  const isCurrent = plan.id === currentPlan;
  const canUpgrade = canUpgradeToPlan(currentPlan, plan.id);
  const highlights = getHeroHighlights(plan.id);
  const isLifetime = plan.id === "LIFETIME";

  return (
    <Box
      component={m.div}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: selected ? 1.01 : 1 }}
      transition={{ duration: 0.4, ease: M3_MOTION_EASE.expressive }}
      sx={{
        position: "relative",
        p: { xs: 2.75, sm: 3.25 },
        borderRadius: `${PRICING_RADIUS.section}px`,
        background: theme.bg,
        border: theme.border,
        boxShadow: theme.glow ?? "0 16px 48px rgba(0,0,0,0.35)",
        overflow: "hidden",
        mx: { sm: "auto" },
        maxWidth: { sm: 440 },
      }}
    >
      {isCurrent && (
        <Chip
          label="Paket Saat Ini"
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            fontWeight: 800,
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        />
      )}

      <Stack spacing={2.25}>
        <Chip
          label={getHeroBadge(plan.id)}
          size="small"
          sx={{
            alignSelf: "flex-start",
            bgcolor: theme.accent,
            color: isLifetime ? "#052e1a" : "#1a1240",
            fontWeight: 900,
            letterSpacing: 0.8,
            fontSize: "0.65rem",
          }}
        />

        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: theme.text, mb: 0.5 }}>
            {getPlanDisplayLabel(plan.id)}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 900, color: theme.accent, letterSpacing: -0.5 }}>
            {plan.priceLabel}
          </Typography>
        </Box>

        {isLifetime && (
          <>
            <SavingsBadge accent={theme.accent} />
            <Stack spacing={0.35}>
              {LIFETIME_VALUE_POINTS.map((point) => (
                <Typography
                  key={point}
                  variant="body2"
                  sx={{ color: theme.textMuted, fontWeight: 700 }}
                >
                  {point}
                </Typography>
              ))}
            </Stack>
          </>
        )}

        <Typography variant="body1" sx={{ color: theme.textMuted, fontWeight: 600, lineHeight: 1.5 }}>
          {getPlanBenefitTagline(plan.id)}
        </Typography>

        <Box sx={{ color: theme.text }}>
          <FeatureChecklist items={highlights} accent={theme.accent} />
        </Box>

        {canUpgrade ? (
          <Button
            variant="contained"
            fullWidth
            disabled={loading}
            onClick={() => onSelect(plan.id as Exclude<PlanId, "FREE">)}
            sx={{
              ...pricingCtaSx,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              py: 1.35,
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Upgrade ke {getPlanDisplayLabel(plan.id)}
          </Button>
        ) : (
          <Button variant="outlined" disabled fullWidth sx={{ fontWeight: 700, minHeight: 48 }}>
            {isCurrent ? "Paket Saat Ini" : "Sudah Termasuk"}
          </Button>
        )}
      </Stack>
    </Box>
  );
}
