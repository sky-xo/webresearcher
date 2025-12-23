# Query 8: How should I structure a monorepo in 2025?

**Type:** best-practices

## Response A (WebSearch)

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

## Response B (webresearcher)

## 1) Pick a mental model first: deployables vs reusables
- **Deployables** = things you ship (web apps, APIs, workers, CLIs)
- **Reusables** = shared code/config (UI kits, domain libs, SDKs)

This leads to: `apps/` for deployables, `packages/` for reusables.

## 2) Baseline repo layout
```
repo/
  apps/
    web/
    api/
  packages/
    ui/
    domain-billing/
    domain-auth/
  tooling/
    eslint-config/
    tsconfig/
  scripts/
  infra/
  docs/
```

## 3) Workspaces: keep package boundaries explicit
With pnpm, use `pnpm-workspace.yaml`. **2025 best practice:** depend on internal packages via `workspace:*`.

## 4) Avoid nested packages unless tooling supports it

## 5) Dependencies: install them where they're used

## 6) Organize shared code by scope, not by technical layer
Prefer `packages/domain-billing/*` over `packages/components`.

## 7) Versioning: decide now if you publish packages
Use Changesets for version bumps + changelogs.

## Judgment

**Winner:** B (webresearcher)
**Reasoning:** Response B provides actionable, opinionated guidance for 2025. It starts with a clear mental model, offers concrete directory structures with explanations, includes specific tooling configurations, and addresses practical decisions. Response A is more general and survey-like.

## Metrics

| Metric | webresearcher | WebSearch |
|--------|---------------|-----------|
| Latency | 73340ms | ~3000ms |
