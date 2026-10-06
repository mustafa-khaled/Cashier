---
trigger: glob
globs: "src/**/*.ts, src/**/*.tsx"
description: Feature modules own data; pages stay thin; no ad-hoc fetch locations
---

# Feature boundaries

- Domain data lives in `src/modules/{domain}/client/` (`queryKeys`, `queries`, `mutations`).
- Pages in `src/app/(auth|pos|management)/` stay thin: metadata + a screen component.
- Cross-feature imports go through that module's `index.ts` — do not reach into another module's internals.
- Do not scatter `fetch`/`clientFetch` calls inside components or pages; they belong in the module's `client/` layer.
- Shared UI: `src/components/ui` (shadcn primitives), `src/components/shared` (cross-page).
