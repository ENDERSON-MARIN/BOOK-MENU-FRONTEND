import { apiClient } from "@/_lib/api-client";
import type {
  CreateMenuRequest,
  DayOfWeek,
  Menu,
  UpdateMenuRequest,
} from "@/_types/menu";

interface GetMenusParams {
  date?: string;
  startDate?: string;
  endDate?: string;
  dayOfWeek?: DayOfWeek;
  isActive?: boolean;
  weekNumber?: number;
}

export const MenuService = {
  async getAll(params?: GetMenusParams): Promise<Menu[]> {
    const queryParams = new URLSearchParams();

    if (params?.date) {
      queryParams.append("date", params.date);
    }
    if (params?.startDate) {
      queryParams.append("startDate", params.startDate);
    }
    if (params?.endDate) {
      queryParams.append("endDate", params.endDate);
    }
    if (params?.dayOfWeek) {
      queryParams.append("dayOfWeek", params.dayOfWeek);
    }
    if (params?.isActive !== undefined) {
      queryParams.append("isActive", params.isActive.toString());
    }
    if (params?.weekNumber !== undefined) {
      queryParams.append("weekNumber", params.weekNumber.toString());
    }

    const query = queryParams.toString();
    const endpoint = query
      ? `/lunch-reservation/menus?${query}`
      : "/lunch-reservation/menus";

    return apiClient<Menu[]>(endpoint);
  },

  async getById(id: string): Promise<Menu> {
    return apiClient<Menu>(`/lunch-reservation/menus/${id}`);
  },

  async getByDate(date: string): Promise<Menu> {
    return apiClient<Menu>(`/lunch-reservation/menus/date/${date}`);
  },

  async getByWeek(weekNumber: number): Promise<Menu[]> {
    return apiClient<Menu[]>(`/lunch-reservation/menus/week/${weekNumber}`);
  },

  async create(data: CreateMenuRequest): Promise<Menu> {
    return apiClient<Menu>("/lunch-reservation/menus", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: UpdateMenuRequest): Promise<Menu> {
    return apiClient<Menu>(`/lunch-reservation/menus/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return apiClient<void>(`/lunch-reservation/menus/${id}`, {
      method: "DELETE",
    });
  },
};
