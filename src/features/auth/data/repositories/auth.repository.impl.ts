import { AuthRepository } from "../../domain/repositories/auth.repository";
import { authApi } from "../network/auth.api";
import { LoginRequest } from "../request/login.request";
import { RegisterRequest } from "../request/register.request";

class AuthRepositoryImpl implements AuthRepository {
  async login(request: LoginRequest) {
    const { data } = await authApi.login(request);
    return data.data;
  }

  async register(request: RegisterRequest) {
    const { data } = await authApi.register(request);
    return data.data;
  }

  async me() {
    const { data } = await authApi.me();
    return data.data;
  }

  async logout() {
    await authApi.logout();
  }
}

export const authService = new AuthRepositoryImpl();
