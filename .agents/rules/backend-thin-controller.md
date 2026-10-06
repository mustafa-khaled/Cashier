---
trigger: glob
globs: "src/app/api/**/*.ts"
description: Keep Route Handlers thin; no workflows in HTTP handlers
---

# Thin route handlers

Allowed in `src/app/api/v1/**/route.ts`: parse params/body, Zod validate against module `contracts`, auth context, one module call, response via `withApi` → `ok`/`created`/`apiErrorResponse`.

Forbidden in route handlers: Drizzle queries, multi-step transactions, business calculations, provider SDK calls (Supabase, payments, email), authorization policy invention, per-handler try/catch.

Handlers are wrapped with `withApi` from `@/shared/api/responses`; thrown `ApiError`s map to the envelope automatically. Business logic lives in the module (`domain/` or `server/`).
