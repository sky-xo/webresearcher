# Query 7: Best practices for error handling in TypeScript APIs

**Type:** best-practices

## Response A (WebSearch)

1. Always Throw Error Objects, Not Primitives
2. Use the Result Pattern with `type Result<T, E> = Success<T> | Error<E>`
3. Enable `useUnknownInCatchVariables` in TypeScript
4. Use Type Guards in Catch Blocks
5. Preserve Stack Traces with the `cause` Property
6. Create Custom Error Classes
7. Use Constant Error Messages
8. Implement Global Error Handling Middleware
9. Don't Silently Ignore Errors
10. Use ESLint Rules
11. Handle Async Errors Properly
12. Use Error Monitoring Tools like Sentry

## Response B (webresearcher)

## 1) Pick one error model and enforce it everywhere
Throw **typed domain errors** in your business layer, then **map them** to HTTP responses at the edge.

## 2) Define a stable error contract
```ts
type ApiError = {
  error: {
    code: string;          // stable, machine-readable
    message: string;       // safe, human-readable
    details?: unknown;     // optional structured data
  };
  traceId: string;
};
```

## 3) Use custom error types with a discriminant
```ts
abstract class DomainError extends Error {
  abstract code: string;
}
class NotFoundError extends DomainError {
  code = "NOT_FOUND";
  constructor(public resource: string, public id: string) {
    super(`${resource} not found`);
  }
}
```

## 4) Centralize HTTP mapping in one place
## 5) Be intentional about HTTP status codes (400, 401, 403, 404, 409, 500, 503)
## 6) Validate input at the boundary
## 7) Don't throw for expected control flow
## 8) Preserve "cause" and add context
## 9) Make errors observable (logs, metrics, tracing)
## 10) Handle async errors correctly
## 11) Be careful with dependency errors
## 12) Testing strategy for errors

## Judgment

**Winner:** B (webresearcher)
**Reasoning:** Response B provides a cohesive, architectural approach specifically tailored to TypeScript APIs, with emphasis on domain-driven error design and HTTP mapping patterns. It includes concrete type definitions and clear separation between business logic and HTTP concerns.

## Metrics

| Metric | webresearcher | WebSearch |
|--------|---------------|-----------|
| Latency | 49989ms | ~3000ms |
