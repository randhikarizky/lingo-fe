import api from "@/global/data/network/axios";
import { BaseResponse } from "@/global/data/response/base.response";
import { ChatRequest } from "../request/chat.request";
import { ChatResponse } from "../response/chat.response";

export type CreateConversationRequest = {
  characterId: string;
  personality: string;
  language: string;
  title?: string;
};

export type ConversationListItem = {
  id: string;
  title: string;
  characterId: string;
  personality: string;
  lastMessage: string | null;
  updatedAt: string;
};

export type ConversationDetail = {
  id: string;
  title: string | null;
  characterId: string;
  personality: string;
  messages: Array<{
    id: string;
    role: "USER" | "ASSISTANT";
    content: string;
    correction: unknown;
    createdAt: string;
  }>;
};

export const conversationApi = {
  chat: (request: ChatRequest) =>
    api.post<BaseResponse<ChatResponse>>("/api/v1/ai/chat", request),
  create: (request: CreateConversationRequest) =>
    api.post<BaseResponse<{ id: string }>>("/api/v1/conversations", request),
  list: () =>
    api.get<BaseResponse<ConversationListItem[]>>("/api/v1/conversations"),
  detail: (id: string) =>
    api.get<BaseResponse<ConversationDetail>>(`/api/v1/conversations/${id}`),
  delete: (id: string) =>
    api.delete<BaseResponse<{ success: boolean }>>(`/api/v1/conversations/${id}`),
};
