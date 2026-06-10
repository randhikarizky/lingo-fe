import { UserEntity } from "../entities/user.entity";
import { LoginRequest } from "../../data/request/login.request";
import { RegisterRequest } from "../../data/request/register.request";

export interface AuthRepository {
  login(request: LoginRequest): Promise<UserEntity>;
  register(request: RegisterRequest): Promise<UserEntity>;
  me(): Promise<UserEntity>;
  logout(): Promise<void>;
}
