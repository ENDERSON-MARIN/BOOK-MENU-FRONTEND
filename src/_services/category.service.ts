import { apiClient } from "@/_lib/api-client";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/_types/category";

interface GetCategoriesParams {
  isActive?: boolean;
}

export const CategoryService = {
  async getAll(params?: GetCategoriesParams): Promise<Category[]> {
    const queryParams = new URLSearchParams();
    if (params?.isActive !== undefined) {
      queryParams.append("isActive", params.isActive.toString());
    }

    const query = queryParams.toString();
    const endpoint = query
      ? `/lunch-reservation/categories?${query}`
      : "/lunch-reservation/categories";

    return apiClient<Category[]>(endpoint);
  },

  async getById(id: string): Promise<Category> {
    return apiClient<Category>(`/lunch-reservation/categories/${id}`);
  },

  async create(data: CreateCategoryRequest): Promise<Category> {
    return apiClient<Category>("/lunch-reservation/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: UpdateCategoryRequest): Promise<Category> {
    return apiClient<Category>(`/lunch-reservation/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return apiClient<void>(`/lunch-reservation/categories/${id}`, {
      method: "DELETE",
    });
  },

  async toggleActive(id: string): Promise<Category> {
    return apiClient<Category>(
      `/lunch-reservation/categories/${id}/toggle-active`,
      {
        method: "PATCH",
      },
    );
  },
};
