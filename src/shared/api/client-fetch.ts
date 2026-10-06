export type ApiClientErrorBody = {
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
    requestId: string;
  };
};

export class ApiClientError extends Error {
  readonly code: string;
  readonly status: number;
  readonly fieldErrors?: Record<string, string[]>;
  readonly requestId?: string;

  constructor(
    code: string,
    message: string,
    status: number,
    fieldErrors?: Record<string, string[]>,
    requestId?: string,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.requestId = requestId;
  }
}

type ClientFetchOptions = RequestInit & { json?: unknown };

export async function clientFetch<T>(
  path: string,
  options: ClientFetchOptions = {},
): Promise<T> {
  const { json, headers, body, ...rest } = options;
  const requestInit: RequestInit = {
    credentials: "same-origin",
    ...rest,
    headers: {
      ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : (body ?? null),
  };

  const response = await fetch(`/api/v1${path}`, requestInit);
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = payload as ApiClientErrorBody | null;
    throw new ApiClientError(
      errorBody?.error?.code ?? "UNKNOWN",
      errorBody?.error?.message ?? "تعذر إتمام الطلب",
      response.status,
      errorBody?.error?.fieldErrors,
      errorBody?.error?.requestId,
    );
  }

  const success = payload as { data: T };
  return success.data;
}
