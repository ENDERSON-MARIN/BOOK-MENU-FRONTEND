import { apiClient } from "@/_lib/api-client";
import type {
  CreateMenuItemRequest,
  MenuItem,
  UpdateMenuItemRequest,
} from "@/_types/menu-item";

interface GetMenuItemsParams {
  categoryId?: string;
  isActive?: boolean;
}

export const MenuItemService = {
  async getAll(params?: GetMenuItemsParams): Promise<MenuItem[]> {
    const queryParams = new URLSearchParams();
    if (params?.categoryId) {
      queryParams.append("categoryId", params.categoryId);
    }
    if (params?.isActive !== undefined) {
      queryParams.append("isActive", params.isActive.toString());
    }

    const query = queryParams.toString();
    const endpoint = query ? `/menu-items?${query}` : "/menu-items";

    return apiClient<MenuItem[]>(endpoint);
  },

  async getById(id: string): Promise<MenuItem> {
    return apiClient<MenuItem>(`/menu-items/${id}`);
  },

  async create(data: CreateMenuItemRequest): Promise<MenuItem> {
    return apiClient<MenuItem>("/menu-items", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: UpdateMenuItemRequest): Promise<MenuItem> {
    return apiClient<MenuItem>(`/menu-items/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return apiClient<void>(`/menu-items/${id}`, {
      method: "DELETE",
    });
  },
};
