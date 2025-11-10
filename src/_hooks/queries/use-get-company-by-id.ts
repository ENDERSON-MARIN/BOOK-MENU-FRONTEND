import { useQuery } from "@tanstack/react-query";

import { CompanyService } from "@/_services/company.service";

export const getCompanyByIdQueryKey = (id: string) => ["company", id];

export function useGetCompanyById(id: string) {
  return useQuery({
    queryKey: getCompanyByIdQueryKey(id),
    queryFn: () => CompanyService.getById(id),
    enabled: !!id,
  });
}
