import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CompanyFormValues } from "@/_schemas/company.schema";
import { CompanyService } from "@/_services/company.service";

import { getCompaniesQueryKey } from "../queries/use-get-companies";
import { getCompanyByIdQueryKey } from "../queries/use-get-company-by-id";

export function useUpdateCompany(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CompanyFormValues>) =>
      CompanyService.update(id, data),
    onSuccess: () => {
      // Invalidate both the companies list and the specific company
      queryClient.invalidateQueries({ queryKey: getCompaniesQueryKey() });
      queryClient.invalidateQueries({ queryKey: getCompanyByIdQueryKey(id) });
    },
  });
}
