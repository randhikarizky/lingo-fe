import { AxiosError } from "axios";

import { BaseResponse } from "@/global/data/response/base.response";
import type { SubscriptionErrorPayload } from "../entities/subscription.entity";

export type ParsedSubscriptionError =
  | {
      type: "quota";
      message: string;
      quotaType: string;
    }
  | {
      type: "feature";
      message: string;
      requiredPlan: string;
    };

export function parseSubscriptionError(error: unknown): ParsedSubscriptionError | null {
  if (!(error instanceof AxiosError)) {
    return null;
  }

  if (error.response?.status !== 403) {
    return null;
  }

  const body = error.response.data as BaseResponse<SubscriptionErrorPayload> | undefined;
  const payload = body?.data;

  if (!payload?.code) {
    return null;
  }

  if (payload.code === "QUOTA_EXCEEDED") {
    return {
      type: "quota",
      message: body?.message ?? "Kuota latihan hari ini telah habis.",
      quotaType: payload.quotaType,
    };
  }

  if (payload.code === "FEATURE_LOCKED") {
    return {
      type: "feature",
      message: body?.message ?? "Fitur ini terkunci untuk paket Anda.",
      requiredPlan: payload.requiredPlan,
    };
  }

  return null;
}
