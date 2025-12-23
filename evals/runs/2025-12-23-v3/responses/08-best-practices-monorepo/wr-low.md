# Query: How should I structure a monorepo in 2025?

**Tool:** webresearcher --effort low
**Latency:** 27s

## Tokens
- Input: 8641
- Output: 1567

## Cost
$0.0371

## Response

A good monorepo structure in 2025 is less about a single "correct" folder tree and more about enforcing **clear boundaries, fast builds (caching), and reproducible installs**. Below is a structure and set of conventions that work well for most teams, with notes for Nx vs Turborepo/pnpm.

---

## 1) Start with a boring top-level layout

Most modern JS/TS monorepos converge on:

```
repo/
  apps/                  # deployable things (web, api, worker, docs site)
    web/
    api/
    worker/
  packages/              # shared libraries + tooling packages
    ui/
    config/              # shared eslint/tsconfig/prettier, etc.
    types/
    utils/
  tooling/               # optional: scripts, generators, codemods
  .github/
  package.json
  pnpm-workspace.yaml    # (or yarn/npm/bun equivalent)
  pnpm-lock.yaml
  turbo.json             # if using Turborepo
  nx.json                # if using Nx
```

This "apps + packages" convention is explicitly recommended by Turborepo's workspace guide. ([turborepo.com](https://turborepo.com/docs/guides/workspaces?utm_source=openai))

**Rule of thumb**
- **`apps/`** = things you deploy/run (Next.js, API, CLI, mobile app, docs site).
- **`packages/`** = things you version, import, and reuse (UI kit, shared TS types, auth client, ESLint config).

---

## 2) Pick your monorepo "engine" (it affects structure & discipline)

### Option A: Turborepo + pnpm workspaces (common, lightweight)
- Use **pnpm workspaces** to define packages (via `pnpm-workspace.yaml`). ([pnpm.io](https://pnpm.io/next/workspaces/?utm_source=openai))
- Use **Turborepo** to orchestrate tasks + caching.
- Turborepo recommends **installing dependencies where they're used** (avoid "everything at root") to improve cache/pruning and reduce phantom dependency issues. ([turborepo.ai](https://turborepo.ai/docs/guides/migrating-from-nx?utm_source=openai))

### Option B: Nx (stronger architecture/graph controls)
- Nx works with many layouts, but it emphasizes **grouping by "scope"** (by app or domain) so code that changes together lives together. ([nx.dev](https://nx.dev/docs/concepts/decisions/folder-structure?utm_source=openai))
- Nx also provides generators to move/remove projects cleanly as the repo evolves. ([nx.dev](https://nx.dev/docs/concepts/decisions/folder-structure?utm_source=openai))

If your question is "how should I structure it?", the safest answer is: **use the apps/packages split, then enforce boundaries with your tool of choice** (Nx boundaries or package-level dependency rules + lint).

---

## 3) Make "shared config" a first-class package

A pattern that scales: create a `packages/config` (or several config packages):

```
packages/
  config/
    eslint/
      package.json
      index.js
    tsconfig/
      package.json
      base.json
    prettier/
      package.json
```

Then each app/package depends on these config packages. This keeps configuration changes reviewable and versioned like code.

---

## 4) Define strict dependency direction (prevents monorepo rot)

A simple dependency policy that stays understandable:

- `apps/*` can depend on `packages/*`
- `packages/*` can depend on other `packages/*` (but avoid cycles)
- "lowest-level" packages (e.g., `types`, `utils`) should not depend on "higher-level" ones (e.g., `ui`, `feature-*`)

Enforce with:
- Nx dep-graph + tags/boundaries (if Nx), or
- ESLint import rules + workspace constraints (if not Nx)

---

## 5) Keep packages shallow; avoid nested-package ambiguity

If you use Turborepo, note it **doesn't support nested packages like `apps/**`** in a way that would create ambiguous nested package boundaries; it expects clear package directories. ([turborepo.com](https://turborepo.com/docs/guides/workspaces?utm_source=openai))
So prefer `apps/*` and `packages/*` (and optional groupings like `packages/shared/*` *without* turning the grouping folder into its own package).

---

## 6) Standardize scripts and task graph at the root

### Root scripts
Keep root scripts as "orchestrators", not the only place logic lives:

- `lint`, `test`, `build`, `typecheck`, `dev`
- each package/app also has its own scripts (so it can run standalone)

### Caching
Use Nx or Turbo task configuration so:
- outputs are declared correctly
- inputs include config files that affect builds
- CI can reuse caches

---

## 7) Decide early: single version vs independent versioning

- If you publish packages, consider **Changesets** for independent versioning and release PRs (common in 2025).
- If you don't publish, keep packages "private" and just version the repo.

---

## A concrete "default" template (works for most TS full-stack teams)

```
repo/
  apps/
    web/                 # Next.js/Remix/etc
    api/                 # Node server
    worker/              # queues/cron
  packages/
    ui/                  # shared components
    types/               # zod schemas / TS types
    db/                  # prisma client or db utilities
    auth/                # auth client/server helpers
    config/              # eslint/tsconfig/etc as packages
  .github/workflows/
  package.json
  pnpm-workspace.yaml
  turbo.json (or nx.json)
```

---

## Two quick questions (so I can tailor this)
1) Is your monorepo mainly **JavaScript/TypeScript**, or multi-language (Go/Python/Rust too)?
2) Are you optimizing more for **CI speed/caching** (Nx/Turbo), or for **strict architecture constraints** (Nx), or for **simplicity** (plain workspaces)?
