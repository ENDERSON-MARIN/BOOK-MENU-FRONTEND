import { apiClient } from "@/_lib/api-client";
import type { WeekDay } from "@/_types/week-day";

export const WeekDayService = {
  async getAll(): Promise<WeekDay[]> {
    return apiClient<WeekDay[]>("/week-days");
  },
};
