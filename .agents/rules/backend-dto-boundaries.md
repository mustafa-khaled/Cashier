---
trigger: glob
globs: "src/**/*.ts"
description: Transport DTOs are module Zod contracts; never expose Drizzle rows
---

# DTO boundaries

External transport contracts are the module's `contracts/` schemas (`src/modules/{domain}/contracts/`). One module's contracts are that module's API — not a global package.

Do not use Drizzle `typeof orders.$inferSelect` rows, table types, or `Partial<Order>` as request/response types.

Map: request DTO (Zod) → domain input → persistence → response DTO.

Prefer separate `Create*Schema`, `*ResponseSchema`, `*QuerySchema` when shapes differ. Money crosses the wire as decimal strings; map to bigint minor units at the boundary.

Validate untrusted input with Zod before application code. Drizzle types are a compile-time/persistence safeguard, not the API boundary.
