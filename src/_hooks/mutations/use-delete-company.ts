import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CompanyService } from "@/_services/company.service";

import { getCompaniesQueryKey } from "../queries/use-get-companies";

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CompanyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getCompaniesQueryKey() });
    },
  });
}
