# Query 5: How does Bun's bundler work?

**Type:** how-it-works

## Response A (WebSearch)

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

## Response B (webresearcher)

Bun's bundler is a fast, native "module graph + transforms + codegen" pipeline:

## 1) Start from entrypoints → build a module graph
- One bundle per entrypoint by default
- For every `import`, Bun resolves the specifier. Plugins can intercept via `onResolve()`
- Resolution depends on `target`: browser, node, or bun

## 2) Load each resolved module (using "loaders")
- Built-in loader based on file extension (JS/TS/JSX/TSX, JSON, TOML, YAML, CSS, HTML, WASM)
- Loaders define what "importing a file" means:
  - TS/TSX: strip TypeScript syntax, treat like JS
  - JS: parse and apply dead-code elimination and tree shaking
  - JSON/TOML/YAML: parse + inline as JS object
  - CSS: bundle into .css output file
  - HTML: parse, treat scripts/links as entrypoints
- Plugins can intercept loading via `onLoad()`

## 3) Parse + transform
- Tree-shaking / dead-code elimination in default pipeline
- Implementation is native and multi-threaded

## 4) Bundle + chunking + output
- Module format: esm (default), cjs/iife (experimental)
- Code splitting with `splitting: true`
- Native watch mode for incremental rebuilds

## Judgment

**Winner:** B (webresearcher)
**Reasoning:** Response B provides a clearer, more structured explanation of *how* the bundler actually works by walking through the technical pipeline. Response A focuses more on *what* the bundler does and its benchmarks rather than the underlying mechanics.

## Metrics

| Metric | webresearcher | WebSearch |
|--------|---------------|-----------|
| Latency | 79410ms | ~2500ms |
