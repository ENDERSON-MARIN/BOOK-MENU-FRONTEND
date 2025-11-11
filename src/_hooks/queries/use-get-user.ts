import { useQuery } from "@tanstack/react-query";

import { UserService } from "@/_services/user.service";

export function useGetUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => UserService.getById(id),
    enabled: !!id,
  });
}
