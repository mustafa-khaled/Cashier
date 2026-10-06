---
trigger: glob
globs: "src/**/*.ts"
description: Throw ApiError from modules; let withApi map errors
---

# Error handling

Throw `ApiError` (or a domain error converted to it) from module code. Trust `withApi` from `@/shared/api/responses` to map it to the error envelope.

Do not wrap every Route Handler in `try/catch` that returns `500 { error }`.

Keep envelopes consistent: `{ message, data }` via `created` / `ok`, errors as `{ error: { code, message, fieldErrors?, requestId } }`. `requestId` is added by `withApi` on failures.
