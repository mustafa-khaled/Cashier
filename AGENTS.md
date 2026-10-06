<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Cashier POS — Agent Guide

Single full-stack Next.js app: Arabic-only RTL point-of-sale. Authoritative product/architecture spec: `docs/Cashier_POS_PRD_Architecture.md`. Module rules: `.agents/rules/*.md` (loaded automatically). Repo uses pnpm (not npm/yarn); no monorepo tooling.

## Stack

Next.js 16 (App Router, `src/`, Turbopack) · React 19 · TypeScript strict (incl. `noUncheckedIndexedAccess`) · Tailwind v4 + shadcn/ui (Radix, `rtl: true`) · TanStack Query · Zod 4 · Drizzle ORM + `postgres` (local Docker Postgres now, Supabase later) · Supabase Auth (`@supabase/ssr`) · Vitest + Testing Library · Playwright · ESLint 9 flat + Prettier + commitlint/husky.

## Commands

| Task | Command |
| --- | --- |
| Dev server | `pnpm dev` |
| Lint / format | `pnpm lint` · `pnpm format` · `pnpm format:check` |
| Types | `pnpm typecheck` (`next typegen && tsc --noEmit`) |
| Unit tests | `pnpm test` |
| E2E | `pnpm test:e2e` (Playwright; `tests/e2e`) |
| DB | `pnpm db:generate` · `pnpm db:migrate` · `pnpm db:studio` · `pnpm db:seed` |
| Local Postgres | `docker compose up -d` (db `cashier`, port 5434) |

Never run `npm`/`npx`/`yarn`. Validate edits with `pnpm lint && pnpm typecheck && pnpm test` before finishing.

## Layout

```
src/app/            App Router: (auth) | (pos) | (management) route groups, api/v1/**
src/modules/{cap}/  Business capability (see .agents/rules/backend-module-boundaries)
src/components/     ui/ (shadcn) + shared/ (cross-page)
src/shared/         api/ (responses, clientFetch), money, dates, errors
src/server/         db/ (Drizzle client + schema/columns), logging, auth
src/env/            Zod env: server.ts (server) + client.ts (NEXT_PUBLIC only)
src/proxy.ts        Next 16 middleware equivalent — pass-through until auth milestone
tests/e2e/          Playwright specs
```

Pages are Server Components (metadata + thin screen import); `'use client'` only in the smallest interactive subtree. Route Handlers validate with the module's Zod `contracts` and wrap with `withApi` → `ok`/`created`; errors are `ApiError` → `{ error: { code, message, fieldErrors?, requestId } }`.

## Conventions

- **Arabic RTL everywhere**: UI copy in Arabic, `lang="ar" dir="rtl"` (set in root layout); don't hardcode `ltr`.
- **Money**: bigint minor units in the domain, decimal strings over the wire, `decimal.js` for intermediate math — `src/shared/money`.
- **Dates**: store UTC, display Africa/Cairo — `src/shared/dates`.
- **Dates/env**: read env only through `src/env`; never `process.env.X` directly.
- **DB**: Drizzle query builders only (no string SQL); schema lives in `src/server/db/schema/`; migrations via `pnpm db:generate`. No business tables yet — only `schema/common.ts` column helpers.
- **Auth**: Supabase server client (`src/server/auth/supabase.ts`) + browser client (`src/lib/supabase/client.ts`); UI role checks are UX only, API authorizes.
- **No mass assignment**: parse with Zod, persist explicit allowlisted fields; totals/status computed in `domain/`.
- **Logging**: structured JSON via `src/server/logging` — never log secrets/tokens/PII.
- **Tests**: pure domain logic gets unit tests colocated (`*.test.ts`); e2e covers critical flows.

## Not built yet (PRD milestones)

Auth flows (login API, session middleware, RBAC), business DB schema/migrations, checkout + order API beyond the health endpoint, products/orders screens (placeholders exist), printing, reports, i18n beyond Arabic. Follow the PRD order; don't invent tables or endpoints outside it.
