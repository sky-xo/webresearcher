# Query: Best practices for error handling in TypeScript APIs

**Tool:** WebSearch
**Latency:** 3.0s

## Response

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
