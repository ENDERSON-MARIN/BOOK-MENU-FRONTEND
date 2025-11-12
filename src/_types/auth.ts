import { User } from "./user";

export interface LoginRequest {
  cpf: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthUser {
  id: string;
  cpf: string;
  name: string;
  role: "ADMIN" | "USER";
  userType: "FIXO" | "NAO_FIXO";
  status: "ATIVO" | "INATIVO";
}
