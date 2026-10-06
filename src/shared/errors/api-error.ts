export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
    requestId: string;
  };
};

export type ApiSuccessBody<T> = {
  message: string;
  data: T;
};

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(
    code: string,
    message: string,
    status = 400,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  static badRequest(
    message: string,
    fieldErrors?: Record<string, string[]>,
  ): ApiError {
    return new ApiError("BAD_REQUEST", message, 400, fieldErrors);
  }

  static unauthorized(message = "غير مصرح"): ApiError {
    return new ApiError("UNAUTHORIZED", message, 401);
  }

  static forbidden(message = "ليس لديك صلاحية لهذه العملية"): ApiError {
    return new ApiError("FORBIDDEN", message, 403);
  }

  static notFound(message = "العنصر غير موجود"): ApiError {
    return new ApiError("NOT_FOUND", message, 404);
  }

  static conflict(code: string, message: string): ApiError {
    return new ApiError(code, message, 409);
  }

  static internal(message = "حدث خطأ غير متوقع"): ApiError {
    return new ApiError("INTERNAL", message, 500);
  }
}
