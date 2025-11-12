import { useQuery } from "@tanstack/react-query";

import { UserService } from "@/_services/user.service";

export function useGetUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => UserService.getAll(),
  });
}
