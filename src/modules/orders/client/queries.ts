import { queryOptions } from "@tanstack/react-query";

import { clientFetch } from "@/shared/api/client-fetch";

import type { OrderResponse } from "../contracts/order-response.schema";
import { orderKeys } from "./query-keys";

export type OrderListParams = {
  cursor?: string;
  limit?: number;
};

export type OrderListPage = {
  items: OrderResponse[];
  nextCursor: string | null;
};

function toQueryString(params: OrderListParams): string {
  const search = new URLSearchParams();
  if (params.cursor) search.set("cursor", params.cursor);
  if (params.limit) search.set("limit", String(params.limit));
  const query = search.toString();
  return query ? `?${query}` : "";
}

export function ordersListOptions(params: OrderListParams = {}) {
  return queryOptions({
    queryKey: orderKeys.list(params),
    queryFn: () =>
      clientFetch<OrderListPage>(`/orders${toQueryString(params)}`),
  });
}

export function orderDetailOptions(orderId: string) {
  return queryOptions({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => clientFetch<OrderResponse>(`/orders/${orderId}`),
  });
}
