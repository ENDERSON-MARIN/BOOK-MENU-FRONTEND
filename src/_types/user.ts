export type UserRole = "ADMIN" | "USER";
export type UserType = "FIXO" | "NAO_FIXO";
export type UserStatus = "ATIVO" | "INATIVO";

export interface User {
  id: string;
  cpf: string;
  name: string;
  role: UserRole;
  userType: UserType;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  cpf: string;
  name: string;
  password: string;
  role: UserRole;
  userType: UserType;
}

export interface UpdateUserRequest {
  name?: string;
  password?: string;
  role?: UserRole;
  userType?: UserType;
}
