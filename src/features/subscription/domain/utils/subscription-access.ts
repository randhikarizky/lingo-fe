import type { PlanId, UserSubscription } from "../entities/subscription.entity";

const PLAN_LABELS: Record<PlanId, string> = {
  FREE: "Free",
  STARTER: "Starter",
  PRO: "Pro",
  LIFETIME: "Lifetime",
};

export function getPlanLabel(planId: string) {
  return PLAN_LABELS[planId as PlanId] ?? planId;
}

export function isScenarioAllowed(subscription: UserSubscription | undefined, scenarioId: string) {
  if (!subscription) return true;

  if (subscription.features.allScenarios) return true;
  if (subscription.features.allowedScenarios === "all") return true;

  return subscription.features.allowedScenarios.includes(scenarioId);
}

export function isTutorAllowed(subscription: UserSubscription | undefined, characterId: string) {
  if (!subscription) return true;

  if (subscription.features.allTutors) return true;
  if (subscription.features.allowedTutors === "all") return true;

  return subscription.features.allowedTutors.includes(characterId);
}

export function formatQuotaLimit(value: number | null) {
  return value === null ? "Tanpa batas" : String(value);
}

export function formatQuotaUsage(used: number, limit: number | null) {
  if (limit === null) {
    return `${used} (tanpa batas)`;
  }

  return `${used} / ${limit}`;
}
