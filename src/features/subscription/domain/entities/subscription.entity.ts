export type PlanId = "FREE" | "STARTER" | "PRO" | "LIFETIME";

export type PublicPlan = {
  id: PlanId;
  label: string;
  description: string;
  priceLabel: string;
  badge?: string;
  limits: {
    speakingMinutesPerDay: number | null;
    aiRepliesPerDay: number | null;
    activeConversations: number | null;
  };
  features: {
    allScenarios: boolean;
    allTutors: boolean;
    sessionSummary: boolean;
    priorityProcessing: boolean;
  };
};

export type UserSubscription = {
  plan: PlanId;
  status: string;
  startedAt: string;
  expiredAt: string | null;
  limits: {
    speakingMinutesPerDay: number | null;
    aiRepliesPerDay: number | null;
    activeConversations: number | null;
  };
  usage: {
    speakingMinutes: number;
    aiReplies: number;
    sttRequests: number;
    ttsRequests: number;
  };
  remaining: {
    speakingMinutes: number | null;
    aiReplies: number | null;
    activeConversations: number | null;
  };
  activeConversations: number;
  features: {
    allScenarios: boolean;
    allTutors: boolean;
    allowedScenarios: "all" | string[];
    allowedTutors: "all" | string[];
    sessionSummary: boolean;
    priorityProcessing: boolean;
  };
};

export type SubscriptionErrorCode = "QUOTA_EXCEEDED" | "FEATURE_LOCKED";

export type SubscriptionErrorPayload =
  | {
      code: "QUOTA_EXCEEDED";
      quotaType: string;
      used: number;
      limit: number | null;
    }
  | {
      code: "FEATURE_LOCKED";
      feature: string;
      requiredPlan: string;
    };
