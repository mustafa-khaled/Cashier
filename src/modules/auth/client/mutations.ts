import { mutationOptions } from "@tanstack/react-query";

import { clientFetch } from "@/shared/api/client-fetch";

import { authKeys } from "./query-keys";

import type { AuthContextDto, LoginRequest } from "../contracts/auth.schema";

export const authMutations = {
  login: () =>
    mutationOptions<AuthContextDto, unknown, LoginRequest>({
      mutationFn: (input) =>
        clientFetch<AuthContextDto>("/auth/login", {
          method: "POST",
          json: input,
        }),
      meta: { invalidateKeys: [authKeys.context()] },
    }),
  logout: () =>
    mutationOptions<{ loggedOut: boolean }, unknown, void>({
      mutationFn: () =>
        clientFetch<{ loggedOut: boolean }>("/auth/logout", {
          method: "POST",
        }),
      meta: { invalidateKeys: [authKeys.context()] },
    }),
};
