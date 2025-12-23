# Query 9: Why might a Next.js build fail with 'Module not found' for a package that exists?

**Type:** troubleshooting

## Response A (WebSearch)

### 1. Case Sensitivity Issues
Works locally on macOS/Windows but fails in CI/CD on Linux.

### 2. Node.js-Only Modules in Client Code
Module not available on client side (like fs).

### 3. Corrupted or Incomplete node_modules
**Solution:** Clear webpack cache by deleting .next folder.

### 4. Custom Path/Alias Misconfiguration

### 5. Directory Naming Conflicts
Parent directory's name ends with "next".

### 6. Node.js Version Mismatch

## Fixes to Try
1. `rm -rf node_modules .next package-lock.json && npm install`
2. Add webpack fallbacks for Node.js modules
3. Check import casing

## Response B (webresearcher)

## 1) Installed locally, but not in build environment
- Dependency only in `devDependencies`, but CI installs production-only deps
- Lockfile mismatch (committed package-lock but build uses pnpm-lock)
- Workspace package not being installed in build step

**Fix:** Ensure package is in "dependencies" if required at build/runtime.

## 2) Case sensitivity differences (macOS/Windows vs Linux)

## 3) Import path that doesn't exist in package's `exports`
Modern packages use `exports` field, making deep imports fail.
**Fix:** Import from the public entry, not deep paths.

## 4) Monorepo / symlink / transpilation issues
**Fix:** Add package to `transpilePackages` in next.config.js.

## 5) Server vs Client boundary problems
Client component imports server-only dependency.
**Fix:** Import node-only packages only from server code.

## 6) Build output mode / tracing exclusions
With `output: "standalone"`, Next may not copy something you need.

### Quick triage checklist
1. Verify it's in `dependencies` (not only `devDependencies`)
2. Reproduce with clean install
3. Run `npm ls <pkg>` in CI-like conditions
4. Check for casing differences
5. Check for non-exported deep imports

## Judgment

**Winner:** B (webresearcher)
**Reasoning:** Response B is more comprehensive and addresses the critical distinction between dev and build environments. It includes important Next.js-specific issues like `exports` field and `transpilePackages` that Response A misses, plus provides a practical triage checklist.

## Metrics

| Metric | webresearcher | WebSearch |
|--------|---------------|-----------|
| Latency | 41740ms | ~2500ms |
