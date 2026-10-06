---
trigger: glob
globs: "src/**/*.ts, src/proxy.ts"
description: Auth, validation, cookies, rate limits, and safe DB writes in Next
---

# Security baseline

- Authenticate first (Supabase session from cookies); authorize the specific resource/action after.
- Never trust client authorization state or expose stack traces/`digest` details to users in production.
- Security headers are set in `next.config.ts`; do not weaken them. `src/proxy.ts` runs on the Edge-ish request path — keep it pass-through until the auth milestone, and never put secrets or business rules in it.
- Zod-validate every untrusted payload before module code (thin handlers do this).
- Rate-limit credential endpoints (login, OTP, password reset) when they are implemented; anonymous POS browsing needs less.
- Never interpolate user input into raw SQL — Drizzle query builders only; avoid user-controlled `ILIKE`/regex patterns without escaping.
- Avoid arbitrary object spreading into `db.update(...).set(...)`.
- Server secrets stay in `src/env/server.ts`; never expose them via props, RSC output, or `NEXT_PUBLIC_*`.
