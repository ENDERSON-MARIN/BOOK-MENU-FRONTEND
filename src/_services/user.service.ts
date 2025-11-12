import { apiClient } from "@/_lib/api-client";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserStatus,
} from "@/_types/user";

export const UserService = {
  async getAll(): Promise<User[]> {
    // A API só suporta o parâmetro includeInactive
    // Filtragem por status, role e userType deve ser feita no frontend
    const endpoint = "/lunch-reservation/users?includeInactive=true";

    return apiClient<User[]>(endpoint);
  },

  async getById(id: string): Promise<User> {
    return apiClient<User>(`/lunch-reservation/users/${id}`);
  },

  async create(data: CreateUserRequest): Promise<User> {
    return apiClient<User>("/lunch-reservation/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: UpdateUserRequest): Promise<User> {
    return apiClient<User>(`/lunch-reservation/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async toggleStatus(id: string, newStatus: UserStatus): Promise<User> {
    return apiClient<User>(`/lunch-reservation/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus }),
    });
  },
};
