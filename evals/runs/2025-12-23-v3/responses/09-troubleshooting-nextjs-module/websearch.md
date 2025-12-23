# Query: Why might a Next.js build fail with 'Module not found' for a package that exists?

**Tool:** WebSearch
**Latency:** 2.5s

## Response

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
