# Query: How does Bun's bundler work?

**Tool:** WebSearch
**Latency:** 2.5s

## Response

## Core Architecture
Bun's codebase is implemented in Zig for quickly parsing and transforming source code. It leverages multi-threading to load and parse modules in parallel.

## How to Use It
Bun's bundler can be used via `bun build` CLI or `Bun.build()` JavaScript API.

## Why Bundling Matters
Reducing HTTP requests is key. Code transforms are also important for TypeScript, JSX, CSS modules.

## Key Features
- Pre-transpiled Output with `target: "bun"`
- Unified Plugin API for bundler and runtime
- CommonJS to ESM Conversion
- Native Plugins for Performance

## Performance
Bun is 1.75x faster than esbuild, 150x faster than Parcel 2, 180x faster than Rollup + Terser, 220x faster than Webpack.
