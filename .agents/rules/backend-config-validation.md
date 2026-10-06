---
trigger: glob
globs: "src/**/*.ts, next.config.ts"
description: Read env only through src/env; fail at startup
---

# Config validation

Never read `process.env.X` in random files.

Use `src/env/server.ts` for server-only env and `src/env/client.ts` for `NEXT_PUBLIC_*` (the only module a Client Component may import from `src/env`). Add new variables to both the schema and `.env.example`.

`next.config.ts` imports `./src/env/server`, so invalid env fails the build/start — not the first request. Production-required secrets belong in a Zod `superRefine`.
