import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";

import { log } from "@/server/logging";
import { ApiError } from "@/shared/errors/api-error";

import type { ApiErrorBody, ApiSuccessBody } from "@/shared/errors/api-error";

function fieldErrorsFromZod(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_root";
    const list = fieldErrors[key] ?? [];
    list.push(issue.message);
    fieldErrors[key] = list;
  }
  return fieldErrors;
}

export function ok<T>(
  data: T,
  message = "OK",
): NextResponse<ApiSuccessBody<T>> {
  return NextResponse.json<ApiSuccessBody<T>>({ message, data });
}

export function created<T>(
  data: T,
  message = "Created",
): NextResponse<ApiSuccessBody<T>> {
  return NextResponse.json<ApiSuccessBody<T>>(
    { message, data },
    { status: 201 },
  );
}

export function apiErrorResponse(
  body: ApiErrorBody,
  status: number,
  requestId: string,
): NextResponse<ApiErrorBody> {
  const response = NextResponse.json<ApiErrorBody>(body, { status });
  response.headers.set("x-request-id", requestId);
  return response;
}

type DefaultRouteContext = {
  params?: Promise<Record<string, string | string[]>>;
};

type ApiHandler<Ctx> = (
  request: NextRequest,
  ctx: Ctx,
) => Promise<Response> | Response;

export function withApi<Ctx = DefaultRouteContext>(
  handler: ApiHandler<Ctx>,
): ApiHandler<Ctx> {
  return async (request, ctx) => {
    const requestId = crypto.randomUUID();
    try {
      const response = await handler(request, ctx);
      response.headers.set("x-request-id", requestId);
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        log(error.status >= 500 ? "error" : "warn", error.code, {
          requestId,
          message: error.message,
          path: request.nextUrl.pathname,
        });
        return apiErrorResponse(
          {
            error: {
              code: error.code,
              message: error.message,
              fieldErrors: error.fieldErrors,
              requestId,
            },
          },
          error.status,
          requestId,
        );
      }

      if (error instanceof ZodError) {
        log("warn", "VALIDATION", {
          requestId,
          path: request.nextUrl.pathname,
        });
        return apiErrorResponse(
          {
            error: {
              code: "VALIDATION",
              message: "بيانات الطلب غير صالحة",
              fieldErrors: fieldErrorsFromZod(error),
              requestId,
            },
          },
          400,
          requestId,
        );
      }

      log("error", "UNHANDLED", {
        requestId,
        path: request.nextUrl.pathname,
        cause: error instanceof Error ? error.message : String(error),
      });
      return apiErrorResponse(
        {
          error: {
            code: "INTERNAL",
            message: "حدث خطأ غير متوقع",
            requestId,
          },
        },
        500,
        requestId,
      );
    }
  };
}
