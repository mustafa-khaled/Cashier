# Cashier POS

Arabic-only (RTL) point-of-sale system. Single full-stack [Next.js](https://nextjs.org) 16 app — no monorepo. Product and architecture spec: [`docs/Cashier_POS_PRD_Architecture.md`](docs/Cashier_POS_PRD_Architecture.md).

## Quickstart

```bash
pnpm install
cp .env.example .env
docker compose up -d     # local Postgres (cashier/cashier on :5434)
pnpm dev                 # http://localhost:3000
```

## Commands

| Task       | Command                                                   |
| ---------- | --------------------------------------------------------- |
| Dev        | `pnpm dev`                                                |
| Lint       | `pnpm lint`                                               |
| Format     | `pnpm format` / `pnpm format:check`                       |
| Types      | `pnpm typecheck`                                          |
| Unit tests | `pnpm test`                                               |
| E2E tests  | `pnpm test:e2e`                                           |
| Build      | `pnpm build`                                              |
| DB schema  | `pnpm db:generate` · `pnpm db:migrate` · `pnpm db:studio` |
| Seed       | `pnpm db:seed`                                            |

Requires Node 22 (`.nvmrc`) and **pnpm** — do not use npm/yarn. Git hooks (husky + lint-staged + commitlint) enforce format, lint, and conventional commits on every commit.

## Structure

```
src/app/         App Router — (auth) | (pos) | (management) groups, api/v1/**
src/modules/     Business capabilities: contracts/ (Zod) domain/ client/ server/
src/components/  shadcn/ui primitives + shared cross-page components
src/shared/      api helpers (withApi, clientFetch), money, dates, errors
src/server/      Drizzle client + schema, structured logging, Supabase auth
src/env/         Zod-validated environment (server + client)
tests/e2e/       Playwright specs
```

Key conventions (details in `AGENTS.md`): Arabic RTL UI, money as bigint minor units → decimal strings on the wire, UTC storage with Africa/Cairo display, thin Route Handlers wrapped in `withApi`, Drizzle query builders only.

## Tooling

ESLint 9 (flat) · Prettier · commitlint (conventional) + husky · Vitest + Testing Library · Playwright · GitHub Actions CI (`.github/workflows/ci.yml`) · Netlify (`netlify.toml`) · Dependabot.
