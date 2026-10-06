---
name: react-query
description: >-
  TanStack Query pattern for Cashier: queryOptions/mutationOptions in
  src/modules/{domain}/client. Use when writing useQuery, useMutation, keys,
  or invalidation.
---

# React Query

Canonical location: `src/modules/{domain}/client/queries.ts` and `mutations.ts`.

Screens call `useQuery(ordersQueries.list(filters))` — not raw `fetch`.

```ts
export const ordersQueries = {
  list: (filters: OrderFilters) =>
    queryOptions({
      queryKey: ["orders", "list", filters] as const,
      queryFn: () =>
        clientFetch<Page<OrderResponse>>("/orders", { query: filters }),
    }),
};
```

Keys include every variable that changes the result.

Prefer renaming hook results to domain nouns (`orders`, `isCreating`) so screens do not leak `data` / `mutate`.

After mutations, invalidate the matching keys — do not duplicate server cache in `useState`.

`clientFetch` from `@/shared/api/client-fetch` only. Map API JSON to UI models at the module boundary; never leak raw transport shapes into components.
