import { apiClient } from "@/_lib/api-client";
import { CompanyFormValues } from "@/_schemas/company.schema";
import { Company } from "@/_types/company";

export const CompanyService = {
  async getAll(): Promise<Company[]> {
    return apiClient<Company[]>("/companies");
  },

  async getById(id: string): Promise<Company> {
    return apiClient<Company>(`/companies/${id}`);
  },

  async create(data: CompanyFormValues): Promise<Company> {
    return apiClient<Company>("/companies", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<CompanyFormValues>): Promise<Company> {
    return apiClient<Company>(`/companies/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`/companies/${id}`, {
      method: "DELETE",
    });
  },
};
