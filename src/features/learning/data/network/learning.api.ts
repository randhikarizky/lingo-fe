import api from "@/global/data/network/axios";
import { BaseResponse } from "@/global/data/response/base.response";
import type {
  EndSessionResponse,
  LearningCatalog,
} from "../../domain/entities/learning-session.entity";

export const learningApi = {
  catalog: () => api.get<BaseResponse<LearningCatalog>>("/api/v1/learning/catalog"),
  endSession: (conversationId: string) =>
    api.post<BaseResponse<EndSessionResponse>>(
      `/api/v1/conversations/${conversationId}/end`
    ),
};
