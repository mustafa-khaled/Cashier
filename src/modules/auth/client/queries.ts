import { queryOptions } from "@tanstack/react-query";

import { clientFetch } from "@/shared/api/client-fetch";

import { authKeys } from "./query-keys";

import type { AuthContextDto } from "../contracts/auth.schema";

export const authQueries = {
  context: () =>
    queryOptions({
      queryKey: authKeys.context(),
      queryFn: () => clientFetch<AuthContextDto>("/auth/me"),
      staleTime: 60_000,
    }),
};
