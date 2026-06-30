"use client";

import {
  useGetConversationDetail,
  useGetConversationList,
} from "@/features/conversation/presentation/controller/conversation.controller";
import { computeGoalProgress } from "../utils/dashboard.utils";

export function useActiveSessionNav() {
  const { data: conversations = [] } = useGetConversationList();
  const activeConversation = conversations.find((item) => item.status === "ACTIVE");
  const { data: detail } = useGetConversationDetail(activeConversation?.id ?? "");

  const progress = detail ? computeGoalProgress(detail.sessionGoals) : 0;

  return {
    activeConversation,
    progress,
    hasIncompleteMission: Boolean(activeConversation),
  };
}
