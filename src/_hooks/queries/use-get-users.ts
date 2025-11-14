import { useQuery } from "@tanstack/react-query";

import { UserService } from "@/_services/user.service";
import type { UserRole, UserStatus, UserType } from "@/_types/user";

interface UseGetUsersParams {
  status?: UserStatus;
  role?: UserRole;
  userType?: UserType;
}

export function useGetUsers(params?: UseGetUsersParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => UserService.getAll(params),
  });
}
