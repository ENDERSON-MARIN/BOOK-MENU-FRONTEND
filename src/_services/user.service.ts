import { apiClient } from "@/_lib/api-client";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserRole,
  UserStatus,
  UserType,
} from "@/_types/user";

interface GetUsersParams {
  status?: UserStatus;
  role?: UserRole;
  userType?: UserType;
}

export const UserService = {
  async getAll(params?: GetUsersParams): Promise<User[]> {
    // A API só suporta o parâmetro includeInactive
    // Filtragem por status, role e userType deve ser feita no frontend
    const endpoint = "/lunch-reservation/users?includeInactive=true";

    const users = await apiClient<User[]>(endpoint);

    // Apply client-side filtering
    if (!params) {
      return users;
    }

    return users.filter((user) => {
      if (params.status && user.status !== params.status) {
        return false;
      }
      if (params.role && user.role !== params.role) {
        return false;
      }
      if (params.userType && user.userType !== params.userType) {
        return false;
      }
      return true;
    });
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
