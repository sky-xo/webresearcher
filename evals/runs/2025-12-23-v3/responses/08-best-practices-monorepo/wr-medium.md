# Query: How should I structure a monorepo in 2025?

**Tool:** webresearcher --effort medium
**Latency:** 28s

## Tokens
- Input: 4439
- Output: 1374

## Cost
$0.0270

## Response

A good monorepo structure in 2025 is less about the exact folder names and more about **clear boundaries, fast CI (caching + "affected" runs), and consistent tooling**. Below is a pragmatic structure that works well for most teams (especially JS/TS, but the ideas generalize).

## 1) Start with three top-level buckets: `apps/`, `packages/`, `tooling/`
**Rule of thumb**
- **`apps/`**: deployable things (web app, API, worker, mobile, docs site). These are allowed to depend on packages.
- **`packages/`**: reusable libraries (UI, domain logic, config packages, SDKs). Packages should *not* depend on apps.
- **`tooling/`** (or `tools/`): scripts, codegen, repo automation, custom CLIs. Tooling can depend on packages.

### Example tree
```txt
repo/
  apps/
    web/
    api/
    worker-email/
  packages/
    ui/
    domain/
    db/
    config-eslint/
    config-ts/
    utils/
  tooling/
    codegen/
    scripts/
  docs/
  infra/
    terraform/            # or pulumi/
    k8s/                  # if relevant
  .github/
    workflows/
  .changeset/             # if you do versioning + changelogs
  package.json
  pnpm-workspace.yaml     # or yarn/npm workspace file
  tsconfig.base.json
  eslint.config.js
  turbo.json              # or nx.json, etc.
```

## 2) Make dependency direction explicit (and enforce it)
Monorepos fail when "everything imports everything".

**Recommended constraints**
- `apps/*` can depend on `packages/*`
- `packages/*` can depend on other `packages/*` (but define layering, e.g. `domain` shouldn't depend on `ui`)
- no imports from `apps/*` inside `packages/*`
- no "deep imports" across package internals (enforce via package `exports` and lint rules)

**How to enforce**
- ESLint rules (`import/no-restricted-paths`, boundaries plugins, or Nx module boundary rules)
- TypeScript path rules only as a dev convenience; rely on real package boundaries for runtime

## 3) Prefer workspace-first package management (and keep builds deterministic)
In 2025, the "happy path" for JS/TS monorepos is still:
- **pnpm workspaces** (very common for speed + strictness), or Yarn, or npm workspaces
- **lockfile committed**
- **Node version pinned** (via `.nvmrc`, `.node-version`, or Volta) and aligned in CI

**Tip:** Keep shared config in **config packages** (e.g. `packages/config-eslint`, `packages/config-ts`) so apps/packages consume them like normal dependencies.

## 4) Standardize tasks and make them cacheable
Whether you use Turborepo, Nx, Bazel, or something else, structure tasks so they:
- run from package roots
- produce declared outputs (so caching works)
- can run in parallel

**Typical task set**
- `lint`
- `typecheck`
- `test`
- `build`
- `dev` (usually non-cacheable)
- `codegen` (cacheable if it has stable inputs)

## 5) Treat internal libraries like real published packages
Even if you never publish them publicly, structure each package as if you could:
- `packages/foo/package.json` with correct `name`, `version` (or private), `exports`
- avoid importing source via relative paths from other packages (consume the package)
- keep a small, intentional public API surface

This pays off massively for refactors and dependency clarity.

## 6) Decide early: single-version vs independent versioning
Two common models:
- **Single version for the whole repo** (simpler releases; great for product suites)
- **Independent versions per package** (more work; great for libraries/SDKs)

If you need independent versions + changelogs, tools like Changesets are a common approach.

## 7) Keep "global config" minimal; push specifics down to packages
Good: one base config + thin per-package configs.
- `tsconfig.base.json` at root, package-level `tsconfig.json` extends it
- one ESLint flat config at root, but allow overrides per package type (app vs library)
- shared test config, but don't force every package into the same runner if it doesn't fit

## 8) Organize by "deployable boundaries," not by team names
Avoid:
- `team-a/`, `team-b/` (changes as org changes)
Prefer:
- `apps/api`, `apps/web`, `packages/ui`, `packages/domain`

If teams need ownership, add:
- `CODEOWNERS`
- tags/metadata (Nx tags, custom metadata files, etc.)

---

### Quick recommendations (if you're doing JS/TS)
- Use `apps/` + `packages/` layout
- Use pnpm workspaces
- Use Turborepo or Nx for caching + affected runs
- Enforce boundaries with lint rules
- Use package `exports` to prevent deep imports
- Keep CI fast by running only affected `lint/typecheck/test/build`

---

If you tell me:
1) your languages (JS/TS only? Go/Rust/Python too?),
2) how you ship (Docker/K8s? serverless? Vercel?), and
3) whether you need independent package versioning,
I can propose a concrete folder layout + tooling stack that fits.
