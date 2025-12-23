# Query: How should I structure a monorepo in 2025?

**Tool:** WebSearch
**Latency:** 3.0s

## Response

## Common Directory Structure
```
/my-monorepo
├── project-a
├── project-b
└── shared-libraries
```

Note that `apps` and `packages` folders is a common opinionated approach.

## Key Principles
- Organizational Alignment
- Separation of Concerns
- Monorepo ≠ Monolith

## Popular Tools (2025)
Bazel, Gradle, Lage, Lerna, moon, Nx, Pants, Rush, Turborepo.

## Benefits
Atomic Commits, Centralized Dependency Management, Enhanced Visibility, Standardized Tooling.

## Watch Out For
Poor Git performance on large-scale projects.
