---
trigger: glob
globs: "src/**/*.ts"
description: Never persist untrusted input; Zod parse then explicit allowlist
---

# No mass assignment

Never:

```ts
await db.update(orders).set(reqBody); // raw request object
Object.assign(order, await request.json()); // any client-controlled fields
```

Parse with the module's Zod contract, then write only explicit allowlisted fields.

This blocks clients from setting privileged fields (prices, totals, `role`, `paymentStatus`, ownership). Totals, prices, and status transitions are computed server-side in `domain/`, never taken from the client.
