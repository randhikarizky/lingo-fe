import api from "@/global/data/network/axios";
import { BaseResponse } from "@/global/data/response/base.response";
import type { PlanId, PublicPlan, UserSubscription } from "../../domain/entities/subscription.entity";

export const subscriptionApi = {
  getPlans: () => api.get<BaseResponse<{ plans: PublicPlan[] }>>("/api/v1/subscription"),
  getMe: () => api.get<BaseResponse<UserSubscription>>("/api/v1/subscription/me"),
  upgrade: (plan: Exclude<PlanId, "FREE">) =>
    api.post<BaseResponse<{ plan: PlanId; message: string }>>(
      "/api/v1/subscription/upgrade",
      { plan }
    ),
};
