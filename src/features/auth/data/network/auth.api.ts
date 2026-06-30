import api from "@/global/data/network/axios";
import { BaseResponse } from "@/global/data/response/base.response";
import { LoginRequest } from "../request/login.request";
import { RegisterRequest } from "../request/register.request";
import { UserEntity } from "../../domain/entities/user.entity";

export const authApi = {
  login: (request: LoginRequest) =>
    api.post<BaseResponse<UserEntity>>("/api/v1/auth/login", request, {
      silentError: true,
    }),

  register: (request: RegisterRequest) =>
    api.post<BaseResponse<UserEntity>>("/api/v1/auth/register", request),

  me: () => api.get<BaseResponse<UserEntity>>("/api/v1/auth/me"),

  logout: () => api.post<BaseResponse<null>>("/api/v1/auth/logout"),
};
