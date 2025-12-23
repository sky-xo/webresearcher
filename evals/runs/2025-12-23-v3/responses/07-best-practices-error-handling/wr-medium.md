# Query: Best practices for error handling in TypeScript APIs

**Tool:** webresearcher --effort medium
**Latency:** 27s

## Tokens
- Input: 4435
- Output: 1529

## Cost
$0.0292

## Response

## 1) Treat errors as a *design surface* (not an afterthought)
- Define a small, explicit set of error categories your API can return (e.g., `VALIDATION`, `AUTH`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `INTERNAL`, `UPSTREAM_TIMEOUT`).
- Keep a clean boundary between:
  - **Domain/service errors** (business meaning)
  - **Transport errors** (HTTP status, response body, headers)

## 2) Use typed, structured errors (don't throw strings)
Create a base error type that carries stable metadata.

```ts
export type ErrorCode =
  | "VALIDATION"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL";

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}
```

Best practices:
- Prefer **`unknown`** for `cause`/`details` and narrow later.
- Use `ErrorOptions` / `cause` when available (Node 16.9+), or store your own `cause`.
- Avoid leaking internal details; keep `details` for logs, not necessarily for clients.

## 3) Centralize HTTP error mapping in one place
All routes should funnel errors through a single handler/middleware.

**Express example:**
```ts
import type { Request, Response, NextFunction } from "express";

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const requestId = req.header("x-request-id");

  if (err instanceof AppError) {
    return res.status(err.status).json({
      requestId,
      error: { code: err.code, message: err.message },
    });
  }

  // Unknown/unexpected error
  return res.status(500).json({
    requestId,
    error: { code: "INTERNAL", message: "Internal Server Error" },
  });
}
```

Benefits:
- Consistent response shape
- No duplicated `try/catch` logic
- One place to control redaction and logging

## 4) Validate inputs early and return 400 with useful, safe details
- Validate **params, query, headers, and body** at the edge.
- Prefer schema validators (Zod, Valibot, Joi, yup) so runtime validation matches your TS types.

Pattern:
- Parse/validate in middleware
- Convert validation failures into `AppError("VALIDATION", 400, ...)`

## 5) Prefer standard formats (Problem Details / RFC 7807)
A common response format reduces client complexity. Example shape:

```json
{
  "type": "https://example.com/problems/validation",
  "title": "Validation Error",
  "status": 400,
  "detail": "Invalid request body",
  "instance": "/v1/users",
  "requestId": "..."
}
```

Even if you don't fully implement RFC 7807, keep your error schema stable and documented.

## 6) Use correct status codes and be consistent
Common mappings:
- `400` validation / malformed request
- `401` unauthenticated (missing/invalid auth)
- `403` authenticated but not allowed
- `404` resource not found
- `409` conflicts (unique constraints, state conflicts)
- `422` semantic errors (optional; many teams just use 400)
- `429` rate limiting
- `500` unexpected server errors
- `502/503/504` upstream failures/timeouts (if you proxy/call other services)

Pick conventions and stick to them across endpoints.

## 7) Don't leak secrets or internals
- Never return stack traces to clients in production.
- Redact sensitive fields in logs (tokens, passwords, cookies, PII).
- Treat DB errors, upstream errors, and parsing errors as potentially sensitive.

## 8) Log with context (and a request/correlation id)
- Generate/propagate `X-Request-Id` (or `traceparent`) on every request.
- Log structured JSON: `{ level, msg, requestId, userId, route, code, status, err }`
- Separate *client-safe message* from *developer/log message*.

## 9) Handle async errors reliably
- In Express, ensure async route errors reach the middleware (wrap handlers or use a library).
- In Fastify, prefer its built-in error handling hooks.

Simple wrapper:
```ts
export const asyncHandler =
  (fn: (...args: any[]) => Promise<any>) =>
  (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);
```

## 10) Decide: exceptions vs Result types (and be consistent)
Two good approaches:
- **Throw exceptions** in services and map them at the boundary (common in Node APIs).
- **Return `Result<T, E>`** (or discriminated unions) for predictable flows, especially for expected failures.

If you use Result types, reserve thrown exceptions for truly unexpected situations.

## 11) Make "expected" errors explicit
Examples:
- Unique constraint violation → map to `CONFLICT` (409)
- Missing record → `NOT_FOUND` (404)
- Business rule violation (e.g., "insufficient balance") → `CONFLICT` or `422` based on your standard

Don't treat these as "500"; clients need deterministic behavior.

## 12) Add timeouts, retries, and idempotency for upstream calls
- Use timeouts for DB/HTTP dependencies.
- Retry only when safe (e.g., network errors, 503) and preferably with backoff.
- For POST endpoints that can be retried by clients, support **idempotency keys**.

## 13) Test error behavior like you test success paths
- Unit test: service throws `AppError("NOT_FOUND", 404, ...)`
- Integration test: route returns correct status + body shape
- Contract test: clients can rely on `error.code` semantics

## 14) Document error codes in your OpenAPI schema
- Make error responses part of the contract (common schema component).
- Document per-endpoint which `error.code` values can occur.

---

### If you tell me your stack, I can tailor this
Are you using Express, Fastify, NestJS, or something else—and do you already have OpenAPI + a validator (e.g., Zod)? I can provide a concrete reference implementation (middleware + error types + example route + OpenAPI schema).
