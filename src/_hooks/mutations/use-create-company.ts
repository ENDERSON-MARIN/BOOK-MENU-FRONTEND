import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CompanyService } from "@/_services/company.service";

import { getCompaniesQueryKey } from "../queries/use-get-companies";

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CompanyService.create,
    onSuccess: () => {
      // Invalidate companies list to refresh the data
      queryClient.invalidateQueries({ queryKey: getCompaniesQueryKey() });
    },
  });
}
