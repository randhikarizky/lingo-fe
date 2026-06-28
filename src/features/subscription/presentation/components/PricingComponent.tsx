"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LoadingTips from "@/global/components/Loading/LoadingTips";
import type { PlanId } from "../../domain/entities/subscription.entity";
import {
  useSubscriptionMe,
  useSubscriptionPlans,
  useUpgradePlan,
} from "../controller/subscription.controller";
import PlanCard from "./PlanCard";
import UpgradeDialog from "./UpgradeDialog";

export default function PricingComponent() {
  const router = useRouter();
  const { data: plans, isLoading: isPlansLoading } = useSubscriptionPlans();
  const { data: subscription, isLoading: isMeLoading } = useSubscriptionMe();
  const upgradePlan = useUpgradePlan();
  const [selectedPlan, setSelectedPlan] = useState<Exclude<PlanId, "FREE"> | null>(null);

  if (isPlansLoading || isMeLoading) {
    return <LoadingTips label="Memuat paket langganan..." />;
  }

  const handleConfirmUpgrade = () => {
    if (!selectedPlan) return;

    upgradePlan.mutate(selectedPlan, {
      onSuccess: () => {
        setSelectedPlan(null);
        router.push("/dashboard");
      },
    });
  };

  const selectedPlanDetails = plans?.find((plan) => plan.id === selectedPlan);

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Paket Lingora
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Pilih paket yang sesuai kebutuhan belajarmu. Pembayaran akan dihubungkan pada rilis berikutnya.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 2,
        }}
      >
        {plans?.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPlan={subscription?.plan}
            loading={upgradePlan.isPending}
            onSelect={setSelectedPlan}
          />
        ))}
      </Box>

      <UpgradeDialog
        open={selectedPlan !== null}
        planId={selectedPlan ?? "STARTER"}
        priceLabel={selectedPlanDetails?.priceLabel}
        loading={upgradePlan.isPending}
        onClose={() => setSelectedPlan(null)}
        onConfirm={handleConfirmUpgrade}
      />
    </Stack>
  );
}
