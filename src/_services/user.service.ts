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
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.role) queryParams.append("role", params.role);
    if (params?.userType) queryParams.append("userType", params.userType);

    const query = queryParams.toString();
    const endpoint = query
      ? `/lunch-reservation/users?${query}`
      : "/lunch-reservation/users";

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
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async toggleStatus(id: string): Promise<User> {
    return apiClient<User>(`/lunch-reservation/users/${id}/status`, {
      method: "PATCH",
    });
  },
};
