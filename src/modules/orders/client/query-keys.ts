export const orderKeys = {
  all: ["orders"] as const,
  list: (params: Record<string, unknown> = {}) =>
    [...orderKeys.all, "list", params] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};
