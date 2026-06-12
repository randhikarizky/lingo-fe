import api from "@/global/data/network/axios";
import { BaseResponse } from "@/global/data/response/base.response";
import { ChatRequest } from "../request/chat.request";
import { ChatResponse } from "../response/chat.response";

export const conversationApi = {
  chat: (request: ChatRequest) =>
    api.post<BaseResponse<ChatResponse>>("/api/v1/ai/chat", request),
};
