import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

import type { PlanId } from "../../domain/entities/subscription.entity";
import { subscriptionService } from "../../data/repositories/subscription.repository.impl";

export const useSubscriptionPlans = () =>
  useQuery({
    queryKey: ["subscription", "plans"],
    queryFn: () => subscriptionService.getPlans(),
  });

export const useSubscriptionMe = () =>
  useQuery({
    queryKey: ["subscription", "me"],
    queryFn: () => subscriptionService.getMe(),
  });

export const useUpgradePlan = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (plan: Exclude<PlanId, "FREE">) => subscriptionService.upgrade(plan),
    onSuccess: (data) => {
      enqueueSnackbar(data.message, { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
};
