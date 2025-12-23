# Query: Best practices for error handling in TypeScript APIs

**Tool:** webresearcher --effort low
**Latency:** 21s

## Tokens
- Input: 4435
- Output: 1303

## Cost
$0.0260

## Response

## 1) Standardize your error shape (internally and over HTTP)
Define a small set of fields you'll always return, and stick to it:

- `code`: stable, machine-readable (e.g., `AUTH_INVALID_TOKEN`, `USER_NOT_FOUND`)
- `message`: human-readable summary
- `status`: HTTP status you returned
- `details`: optional structured metadata (field errors, constraints, etc.)
- `requestId` / `traceId`: for support + correlation

This prevents ad-hoc `throw new Error("...")` from leaking inconsistent responses.

**Tip:** Keep *internal* error objects richer than what you expose publicly; map internal → public at the boundary.

---

## 2) Use typed error classes (and avoid stringly-typed errors)
Create a base `AppError` and extend it:

```ts
export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, details?: unknown) {
    super("NOT_FOUND", 404, `${resource} not found`, details);
  }
}
```

Benefits:
- central mapping to HTTP
- easier logging / alerting
- consistent typing across layers

---

## 3) Handle errors in exactly one place (a global error middleware)
In Express/Fastify/etc., do **not** sprinkle `res.status(...).json(...)` across your code. Throw errors; handle centrally.

### Express example
```ts
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  const requestId = req.header("x-request-id");

  if (err instanceof AppError) {
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
      status: err.status,
      details: err.details,
      requestId,
    });
  }

  // Unknown/unexpected error: don't leak internals
  console.error({ err, requestId });
  return res.status(500).json({
    code: "INTERNAL",
    message: "Unexpected error",
    status: 500,
    requestId,
  });
});
```

---

## 4) Validate input early, return 400/422 with field-level details
Use a schema validator (Zod, Valibot, Yup, Joi). Convert validation failures into a dedicated error type:

- `400 Bad Request` if the request is malformed (invalid JSON, missing required fields)
- `422 Unprocessable Entity` if syntactically valid but fails semantic rules (often used for field validation)

Return a predictable `details` shape like:
```json
{
  "code": "VALIDATION_ERROR",
  "details": [{ "path": "email", "message": "Invalid email" }]
}
```

---

## 5) Don't leak secrets or internals in messages
Never return:
- stack traces
- SQL errors / query text
- upstream service responses verbatim
- file paths, environment data, tokens

Instead:
- log the full error server-side
- return a safe message + `requestId`

---

## 6) Treat "expected" failures differently from "bugs"
Create a rule of thumb:

**Expected** (user-caused / business rules / upstream known failures):
- return a specific status + code (`409`, `404`, `403`, `429`, etc.)
- do not page on-call unless abnormal volume

**Unexpected** (programmer errors, invariants broken):
- return `500`
- log with high severity; consider alerting

---

## 7) Map domains/layers to errors cleanly
Avoid "HTTP everywhere" in your core logic.

- Domain layer throws `DomainError`s (e.g., `InsufficientBalance`)
- API layer maps them to HTTP (`409 Conflict` with `INSUFFICIENT_BALANCE`)
- Infrastructure layer wraps low-level failures (DB timeout → `DependencyError`)

---

## 8) Use `unknown` in catches; narrow safely
In TypeScript, prefer:

```ts
try {
  ...
} catch (err: unknown) {
  if (err instanceof AppError) throw err;
  throw new AppError("INTERNAL", 500, "Unexpected error", undefined, err);
}
```

This prevents accidental assumptions like `err.message` existing.

---

## 9) Include `cause` and preserve stack context
When wrapping errors, keep the original as the cause (Node 16+ supports `new Error(msg, { cause })` too).

This is crucial for debugging and root-cause analysis.

---

## 10) Log structured, with levels and correlation IDs
Log JSON objects (not concatenated strings), include:
- `requestId`, user id (if available), route, latency
- error `code`, `status`, and `cause` chain
- sampling for noisy errors

Also ensure `x-request-id` is generated if missing and returned to clients.

---

## 11) Handle async errors correctly
- Express needs `next(err)` or an async wrapper to avoid unhandled rejections.
- In Fastify, use its built-in error handler.
- Globally, crash on truly unhandled errors in many production setups (or at least alert), but prefer preventing them.

---

## 12) Choose HTTP status codes consistently
Common mapping:
- `400` malformed input
- `401` unauthenticated
- `403` authenticated but not allowed
- `404` not found (avoid leaking existence if sensitive)
- `409` conflict (unique constraint, state conflict)
- `422` validation/semantic errors (if you use it)
- `429` rate limit
- `500` unexpected
- `502/503/504` upstream dependency problems

---

### If you tell me your stack, I can tailor this
Are you using **Express**, **Fastify**, **NestJS**, **tRPC**, or something else—and do you want an example with **Zod** validation + an `AppError` hierarchy + error-to-HTTP mapping?
