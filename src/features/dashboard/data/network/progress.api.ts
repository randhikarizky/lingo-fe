import api from "@/global/data/network/axios";
import { BaseResponse } from "@/global/data/response/base.response";

export type ProgressSummary = {
  conversationCount: number;
  messageCount: number;
  speakingMinutes: number;
  currentStreak: number;
  lastPracticeDate: string | null;
};

export type ProgressActivity = {
  date: string;
  messages: number;
};

export const progressApi = {
  getSummary: () =>
    api.get<BaseResponse<ProgressSummary>>("/api/v1/progress/summary"),
  getActivity: () =>
    api.get<BaseResponse<ProgressActivity[]>>("/api/v1/progress/activity"),
};
