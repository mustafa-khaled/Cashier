---
trigger: glob
globs: "src/**/*.ts, src/**/*.tsx"
description: Module-first layout under src/modules; Next/Drizzle are adapters
---

# Module boundaries

MODULE FIRST, LAYER SECOND.

Identify the business capability before creating files. Route Handlers, Drizzle, and Supabase Auth are adapters around business rules — not the application.

## Existing modules

Match `src/modules/{feature}/` (live example: `orders`). Public exports go through the module's `index.ts`. Do not invent a parallel tree beside an existing module.

## Module shape

```
src/modules/{capability}/
  index.ts       # public exports only
  contracts/     # Zod request/response schemas — the module's API
  domain/        # pure types, state rules, calculations — no Next, no Drizzle
  client/        # queryKeys + queryOptions/mutationOptions for the UI
  server/        # queries, commands, repositories — add when a module needs DB
```

Not every module needs every folder. `domain/` must not import Next or Drizzle. `client/` must not import `server/` or `src/env/server`.

Route Handlers under `src/app/api/v1/**` stay thin: validate with the module's `contracts`, call one function, respond via `ok`/`created`/`ApiError`.
