---
name: react-query
description: >-
  TanStack Query pattern for Cashier: hooks in client/hooks.ts backed by
  queryOptions/mutationOptions in src/modules/{domain}/client. Use when
  writing useQuery, useMutation, keys, or invalidation.
---

# React Query

Canonical locations: `src/modules/{domain}/client/` — `query-keys.ts`,
`queries.ts`, `mutations.ts`, `hooks.ts`.

Screens call module hooks only (`useOrders()`, `useCreateUser()`) — never
`useQuery`/`useMutation` directly and never import `@tanstack/react-query`
(enforced by ESLint for `src/app/**` and `src/components/**`).

```ts
// client/queries.ts — data layer
export const bookingQueries = {
  detail: (bookingId: string) =>
    queryOptions({
      queryKey: bookingKeys.detail(bookingId),
      queryFn: () => clientFetch<BookingResponse>(`/bookings/${bookingId}`),
    }),
};

// client/hooks.ts — the only thing screens import
export function useBooking() {
  const { bookingId } = useParams(); // URL params live inside the hook
  const { data, isLoading, error } = useQuery(bookingQueries.detail(bookingId));
  return { booking: data, isLoading, error };
}
```

Conventions:

- Rename hook results to domain nouns (`booking`, `isCreating`) so screens do
  not leak `data` / `mutate`.
- `onSuccess`/`onError` (navigation, cache writes, Arabic error messages) live
  inside the hook, not in components.
- Keys include every variable that changes the result.
- After mutations, invalidate the matching keys — `meta: { invalidateKeys }` on
  the mutation option is consumed centrally by `MutationCache` in
  `src/app/providers.tsx`. Do not duplicate server cache in `useState`.

`clientFetch` from `@/shared/api/client-fetch` only. Map API JSON to UI models at the module boundary; never leak raw transport shapes into components.
