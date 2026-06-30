import type { PlanId } from "../../domain/entities/subscription.entity";
import { subscriptionApi } from "../network/subscription.api";

class SubscriptionRepositoryImpl {
  async getPlans() {
    const { data } = await subscriptionApi.getPlans();
    return data.data.plans;
  }

  async getMe() {
    const { data } = await subscriptionApi.getMe();
    return data.data;
  }

  async upgrade(plan: Exclude<PlanId, "FREE">) {
    const { data } = await subscriptionApi.upgrade(plan);
    return data.data;
  }
}

export const subscriptionService = new SubscriptionRepositoryImpl();
