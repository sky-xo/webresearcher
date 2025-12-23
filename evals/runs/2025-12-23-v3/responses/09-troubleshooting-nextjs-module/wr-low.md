# Query: Why might a Next.js build fail with 'Module not found' for a package that exists?

**Tool:** webresearcher --effort low
**Latency:** 20s

## Tokens
- Input: 4445
- Output: 867

## Cost
$0.0199

## Response

A Next.js build can throw **"Module not found"** even though the package "exists" for a bunch of reasons that boil down to: **the package is present somewhere, but not resolvable from the build environment the way Next/Webpack expects.** Common causes:

## 1) Installed in the "wrong" place (monorepos / workspaces)
- The package may be in the repo root `node_modules`, but the Next app is building from a subpackage and **doesn't see it** (or sees a different dependency graph).
- With pnpm/yarn workspaces, a dependency might be available via hoisting locally, but **not declared** in the app's own `package.json`.
**Fix:** add it to the Next app's dependencies (not just the workspace), and ensure workspace config is correct.

## 2) Dev dependency used at build/runtime
Next's build runs in a "production-like" mode in CI/hosting. If the package is in `devDependencies`, some environments install with `--omit=dev` / `NODE_ENV=production`, so it's "present locally" but missing in CI.
**Fix:** move it to `dependencies` if it's needed during build/runtime.

## 3) Case sensitivity differences (Mac/Windows vs Linux)
Local dev on a case-insensitive filesystem can succeed even if you wrote:
```ts
import foo from "Some-Package";
```
but the real package is `some-package`, and Linux CI is case-sensitive → build fails.
**Fix:** match exact casing of import paths and filenames.

## 4) Incorrect import path / subpath exports restrictions
The package may exist, but the path you import doesn't:
- Importing internal files: `pkg/dist/index.js`
- Importing a subpath not exported in `"exports"` (Node's package exports map):
  `import "pkg/some/internal"`
Modern bundlers respect `exports`, so "it exists on disk" but is not a valid import target.
**Fix:** import only documented entrypoints, or update the package/version.

## 5) ESM vs CJS resolution mismatch
Some packages ship ESM-only, CJS-only, or have conditional exports. A build may fail if:
- you `require()` an ESM-only package
- Next/Webpack chooses a different condition than Node
**Fix:** use the correct import style, upgrade Next, or configure transpilation (e.g., `transpilePackages`) or `experimental.esmExternals` depending on your Next version.

## 6) Dependency not included in the lockfile / stale installs
You might have it in `node_modules` from an old install, but:
- `package.json` / lockfile doesn't include it
- CI uses `npm ci` / `pnpm --frozen-lockfile`, which recreates a clean install and it disappears
**Fix:** ensure it's in `package.json` and lockfile; delete `node_modules` and reinstall locally to reproduce.

## 7) Multiple package managers / mismatched Node versions
Switching between npm/yarn/pnpm or Node versions can create a local state where the package "seems installed" but resolution differs in CI.
**Fix:** standardize on one package manager, commit the correct lockfile, and pin Node (e.g., via `.nvmrc`, `engines`, CI config).

## 8) Using a different build environment than local (Docker/Vercel/CI)
Build runs from a different working directory, different `NEXT_PUBLIC_*` env, different `baseUrl/paths`, etc. In monorepos especially, the build context can omit directories.
**Fix:** check the build context and working directory; ensure the dependency is part of the app package that's being built.

---

### Fast way to narrow it down
If you tell me:
1) the exact error line (the import that fails),
2) your package manager (npm/yarn/pnpm) and whether it's a monorepo, and
3) whether it fails locally or only in CI/Vercel,
I can usually pinpoint which of the above is happening and what to change.
