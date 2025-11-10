import { useQuery } from "@tanstack/react-query";

import { CompanyService } from "@/_services/company.service";

export const getCompaniesQueryKey = () => ["companies"];

export function useGetCompanies() {
  return useQuery({
    queryKey: getCompaniesQueryKey(),
    queryFn: () => CompanyService.getAll(),
  });
}
