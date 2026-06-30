"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "framer-motion";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { PlanId, PublicPlan } from "../../../domain/entities/subscription.entity";
import type { BillingPeriod } from "../../utils/pricing.utils";
import { canUpgradeToPlan, formatStickyPrice, getPlanDisplayLabel } from "../../utils/pricing.utils";
import { PRICING_RADIUS, pricingCtaSx } from "./pricing.tokens";
import { APP_BOTTOM_NAV_HEIGHT } from "@/global/constants/layout";
import { M3_MOTION_EASE } from "@/theme/animate/m3-page";

type Props = {
  plan?: PublicPlan;
  currentPlan: PlanId;
  billing: BillingPeriod;
  loading?: boolean;
  onUpgrade: () => void;
};

export default function StickyUpgradeBar({ plan, currentPlan, billing, loading, onUpgrade }: Props) {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !plan) return null;

  const canUpgrade = canUpgradeToPlan(currentPlan, plan.id);

  return createPortal(
    <Box
      component={m.div}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: M3_MOTION_EASE.decelerate }}
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        mx: "auto",
        bottom: APP_BOTTOM_NAV_HEIGHT,
        width: "100%",
        maxWidth: 480,
        zIndex: 1090,
        px: 2,
        py: 1.5,
        borderRadius: 0,
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: alpha(theme.palette.background.default, 0.97),
        backdropFilter: "blur(12px)",
        boxShadow: `0 -6px 24px ${alpha(theme.palette.common.black, 0.1)}`,
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            <Stack
              key={plan.id}
              component={m.div}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              spacing={0.15}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                {canUpgrade ? "Rekomendasi" : "Paketmu"}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 900 }} noWrap>
                Paket {getPlanDisplayLabel(plan.id)}
              </Typography>
              <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700 }} noWrap>
                {formatStickyPrice(plan, billing)}
              </Typography>
            </Stack>
          </AnimatePresence>
        </Box>
        <Button
          variant="contained"
          disabled={!canUpgrade || loading}
          onClick={onUpgrade}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
          sx={{
            ...pricingCtaSx,
            flexShrink: 0,
            minWidth: 108,
            borderRadius: `${PRICING_RADIUS.item}px`,
          }}
        >
          {loading ? "Memproses..." : canUpgrade ? "Tingkatkan" : "Aktif"}
        </Button>
      </Stack>
    </Box>,
    document.body
  );
}
