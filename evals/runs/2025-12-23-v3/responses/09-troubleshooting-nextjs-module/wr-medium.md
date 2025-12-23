# Query: Why might a Next.js build fail with 'Module not found' for a package that exists?

**Tool:** webresearcher --effort medium
**Latency:** 18s

## Tokens
- Input: 4445
- Output: 933

## Cost
$0.0208

## Response

A Next.js build can throw **"Module not found"** even when a package "exists" (in the repo or even in `node_modules`) because the build environment and bundler resolve modules more strictly than local dev. Common causes:

## 1) Dependency isn't actually installed in the build environment
- **CI/build server ran `npm ci` / `pnpm install --frozen-lockfile` and the lockfile doesn't include it**, or it's only installed locally.
- The package is listed in the wrong place (e.g., in a different workspace/package than the one being built).

**Check:** In the failing environment, run `node -p "require.resolve('the-package')"` (or `pnpm why the-package` / `npm ls the-package`).

## 2) It's in `devDependencies`, but the build runs with production-only installs
If your build pipeline installs only production deps (e.g., `NODE_ENV=production` + `npm ci --omit=dev`), then a package used during `next build` must be in **`dependencies`**, not `devDependencies`.

**Typical symptom:** Works locally, fails on Vercel/CI or in Docker production stage.

## 3) Monorepo/workspaces: dependency is in the wrong `package.json`
In a monorepo, you might have added the dependency to the **root** or a **different package**, but the Next.js app package that imports it doesn't declare it.

**Rule of thumb:** The package that has the `import ... from 'x'` must list `x` in its own `dependencies`.

## 4) Case sensitivity differences (macOS/Windows vs Linux)
Your import might not match the exact casing of the file/package export.
- Local dev on macOS/Windows can be case-insensitive
- CI/Linux build is case-sensitive

**Example:** `import foo from 'Some-Package'` but actual is `some-package`, or `./Utils` vs `./utils`.

## 5) Different resolution rules between Next dev and production build
A few patterns sometimes "seem to work" in dev but fail in build:
- Importing from a package's **internal files** that aren't exported (`pkg/dist/foo`) when the package uses `"exports"` and doesn't expose that path.
- Relying on Node-only resolution behaviors that webpack/SWC won't mirror the same way.

**Symptom:** Error mentions a deep path like `the-package/some/internal/module`.

## 6) ESM/CJS or "exports" incompatibility
The package may be:
- ESM-only, but you're importing it in a way Next can't bundle for your target, or
- using conditional exports that differ between environments (`browser`/`node` conditions).

This can show up as "module not found" even though the package is present, because the resolver can't find a compatible entry.

## 7) Peer dependency / optional dependency not present
Some libraries require you to install a peer dependency yourself (e.g., `react`, `styled-components`, `@emotion/*`, etc.). If that peer isn't installed, resolution can fail at build.

**Check:** Look for warnings about unmet peer deps during install.

## 8) Caching / stale build artifacts
- CI cache restored an old `node_modules` or `.next/cache`
- Lockfile changed but cache wasn't invalidated

**Fix:** Clear install/build caches and rebuild from scratch.

## Quick triage checklist
1. Confirm the importing package lists the dependency in its **own** `dependencies`.
2. Ensure CI isn't omitting dev deps if the package is needed during `next build`.
3. Verify exact casing of the import.
4. Avoid deep imports not allowed by the package's `"exports"`.
5. Clear caches and reinstall from a clean state.

If you paste the exact error line (the missing module string) and your `package.json` snippet (dependencies/devDependencies + whether you're using workspaces), I can usually pinpoint which of the above is most likely.
