"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import LoadingTips from "@/global/components/Loading/LoadingTips";
import { APP_BOTTOM_NAV_HEIGHT } from "@/global/constants/layout";
import { M3_MOTION_EASE } from "@/theme/animate/m3-page";
import type { PlanId } from "../../domain/entities/subscription.entity";
import {
  useSubscriptionMe,
  useSubscriptionPlans,
  useUpgradePlan,
} from "../controller/subscription.controller";
import {
  type BillingPeriod,
  getDefaultStickyPlanId,
  getVisiblePlans,
  canUpgradeToPlan,
} from "../utils/pricing.utils";
import UpgradeDialog from "./UpgradeDialog";
import PricingHero from "./pricing/PricingHero";
import BenefitGrid from "./pricing/BenefitGrid";
import PlanToggle from "./pricing/PlanToggle";
import HeroPlanCard from "./pricing/HeroPlanCard";
import PlanCardV2 from "./pricing/PlanCardV2";
import PlanComparisonTable from "./pricing/PlanComparisonTable";
import TrustSection from "./pricing/TrustSection";
import FAQAccordion from "./pricing/FAQAccordion";
import StickyUpgradeBar from "./pricing/StickyUpgradeBar";
import { PRICING_SECTION_SPACING, STICKY_UPGRADE_BAR_HEIGHT } from "./pricing/pricing.tokens";

export default function PricingComponent() {
  const router = useRouter();
  const { data: plans, isLoading: isPlansLoading } = useSubscriptionPlans();
  const { data: subscription, isLoading: isMeLoading } = useSubscriptionMe();
  const upgradePlan = useUpgradePlan();

  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [highlightedPlanId, setHighlightedPlanId] = useState<PlanId | null>(null);
  const [dialogPlanId, setDialogPlanId] = useState<Exclude<PlanId, "FREE"> | null>(null);

  const currentPlan = subscription?.plan ?? "FREE";

  useEffect(() => {
    setHighlightedPlanId(null);
  }, [billing]);

  const visiblePlans = useMemo(
    () => getVisiblePlans(plans ?? [], billing),
    [plans, billing]
  );

  const heroPlan = useMemo(() => {
    if (billing === "lifetime") {
      return visiblePlans.find((plan) => plan.id === "LIFETIME");
    }
    return visiblePlans.find((plan) => plan.id === "STARTER");
  }, [visiblePlans, billing]);

  const secondaryPlans = useMemo(() => {
    if (billing === "lifetime") return [];
    return visiblePlans.filter((plan) => plan.id !== "STARTER");
  }, [visiblePlans, billing]);

  const stickyPlanId = highlightedPlanId ?? getDefaultStickyPlanId(currentPlan, billing);
  const stickyPlan = plans?.find((plan) => plan.id === stickyPlanId);
  const dialogPlanDetails = plans?.find((plan) => plan.id === dialogPlanId);

  if (isPlansLoading || isMeLoading) {
    return <LoadingTips label="Memuat paket belajar..." />;
  }

  const openUpgradeDialog = (planId: Exclude<PlanId, "FREE">) => {
    setHighlightedPlanId(planId);
    setDialogPlanId(planId);
  };

  const handleConfirmUpgrade = () => {
    if (!dialogPlanId) return;

    upgradePlan.mutate(dialogPlanId, {
      onSuccess: () => {
        setDialogPlanId(null);
        router.push("/dashboard");
      },
    });
  };

  const handleStickyUpgrade = () => {
    if (!stickyPlan || stickyPlan.id === "FREE") return;
    if (!canUpgradeToPlan(currentPlan, stickyPlan.id)) return;
    openUpgradeDialog(stickyPlan.id as Exclude<PlanId, "FREE">);
  };

  return (
    <>
      <Stack
        spacing={PRICING_SECTION_SPACING}
        sx={{
          pb: `${APP_BOTTOM_NAV_HEIGHT + STICKY_UPGRADE_BAR_HEIGHT + 16}px`,
        }}
      >
        <PricingHero />
        <BenefitGrid />
        <PlanToggle value={billing} onChange={setBilling} />

        <AnimatePresence mode="wait">
          <Box
            key={billing}
            component={m.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: M3_MOTION_EASE.decelerate }}
          >
            <Stack spacing={3}>
              {heroPlan && (
                <HeroPlanCard
                  plan={heroPlan}
                  currentPlan={currentPlan}
                  loading={upgradePlan.isPending}
                  selected={highlightedPlanId === heroPlan.id || highlightedPlanId === null}
                  onSelect={openUpgradeDialog}
                />
              )}

              {secondaryPlans.length > 0 && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                    gap: 2,
                  }}
                >
                  {secondaryPlans.map((plan) => (
                    <PlanCardV2
                      key={plan.id}
                      plan={plan}
                      currentPlan={currentPlan}
                      loading={upgradePlan.isPending}
                      selected={highlightedPlanId === plan.id}
                      onHighlight={setHighlightedPlanId}
                      onSelect={openUpgradeDialog}
                    />
                  ))}
                </Box>
              )}
            </Stack>
          </Box>
        </AnimatePresence>

        {billing === "monthly" && <PlanComparisonTable currentPlan={currentPlan} />}
        <TrustSection />
        <FAQAccordion />
      </Stack>

      <StickyUpgradeBar
        plan={stickyPlan}
        currentPlan={currentPlan}
        billing={billing}
        loading={upgradePlan.isPending}
        onUpgrade={handleStickyUpgrade}
      />

      <UpgradeDialog
        open={dialogPlanId !== null}
        planId={dialogPlanId ?? "STARTER"}
        priceLabel={dialogPlanDetails?.priceLabel}
        loading={upgradePlan.isPending}
        onClose={() => setDialogPlanId(null)}
        onConfirm={handleConfirmUpgrade}
      />
    </>
  );
}
