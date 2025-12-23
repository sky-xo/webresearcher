# Query: How does Bun's bundler work?

**Tool:** webresearcher --effort medium
**Latency:** 41s

## Tokens
- Input: 20999
- Output: 2494

## Cost
$0.0717

## Response

Bun's bundler is the native "build pipeline" behind `bun build` (CLI) and `Bun.build()` (JS API). Conceptually it works like most modern JS bundlers—**dependency graph → transforms/optimizations → output files**—but it's tightly integrated with Bun's runtime and transpiler. ([bun.sh](https://bun.sh/docs/bundler))

## 1) Start from entrypoints → build a module graph
You give Bun one or more **entrypoints**; it crawls `import`/`require` statements, resolves them, and builds a full dependency graph. Bun emits **one entry bundle per entrypoint** (plus shared chunks/assets when applicable). ([bun.sh](https://bun.sh/docs/bundler))

## 2) Resolve modules based on `target` + package "exports" conditions
Resolution behavior depends on the build **target** (`browser`, `bun`, `node`) and the conditions used for `package.json` `"exports"`. For example, the `browser` target prioritizes browser-appropriate export conditions; `node` prioritizes `"node"`. ([bun.sh](https://bun.sh/docs/bundler?utm_source=openai))

A Bun-specific detail: when targeting Bun, output gets a `// @bun` pragma so the Bun runtime can skip re-transpiling that file at run time. ([bun.sh](https://bun.sh/docs/bundler))

## 3) Parse + transpile using Bun's built-in transpiler (TS/JSX "just work")
For JS/TS/JSX file types, Bun uses its built-in transpiler to parse and convert TypeScript/JSX to plain JS. It also applies default optimizations like **dead-code elimination and tree-shaking**. It generally does **not** downlevel modern JS syntax for older engines; new syntax tends to stay new in the output. ([bun.sh](https://bun.sh/docs/bundler))

Bun also emphasizes performance here, using an optimized native parser/transpiler stack (often compared to esbuild-style workflows). ([bun.sh](https://bun.sh/docs/bundler/vs-esbuild?utm_source=openai))

## 4) Apply bundling features: code splitting, formats, sourcemaps, minify
Key build-stage behaviors you can enable/configure:
- **Code splitting** (shared chunks) via `splitting` ([bun.sh](https://bun.sh/docs/bundler))
- **Output format**: defaults to **ESM**, with **experimental** `cjs` and `iife` ([bun.sh](https://bun.sh/docs/bundler))
- **Sourcemaps**, **minification**, and other emit-time controls (documented under the bundler options) ([bun.sh](https://bun.sh/docs/bundler))

## 5) Non-JS imports: "loaders" (inline data) vs "assets" (copy files)
Bun has built-in loaders for a bunch of file types:
- Data/text files like `.json`, `.toml`, `.yaml`, `.txt` can be parsed and **inlined** into the JS bundle. ([bun.sh](https://bun.sh/docs/bundler))
- `.css` can be bundled into a CSS output. ([bun.sh](https://bun.sh/docs/bundler))
- `.html` can be processed so referenced scripts/styles/assets get bundled. ([bun.sh](https://bun.sh/docs/bundler))
- Unknown extensions are treated as **assets**: copied into `outdir`, and the import becomes a path/URL to the copied file. ([bun.sh](https://bun.sh/docs/bundler))

Plugins can override/extend loader behavior. ([bun.sh](https://bun.sh/docs/bundler))

## 6) Extra: compile to a single-file executable (+ optional bytecode)
`bun build --compile` can produce a **single-file executable** for deployment. There's also an experimental `--bytecode` option to precompile to bytecode to reduce cold-start parsing overhead. ([bun.com](https://bun.com/docs/bundler/executables?utm_source=openai))

## One practical "difference in feel" vs esbuild
Bun "**bundles by default**" (no `--bundle` flag needed). If you want "transpile only", you'd use `Bun.Transpiler` instead of the bundler. ([bun.sh](https://bun.sh/docs/bundler/vs-esbuild?utm_source=openai))

If you tell me your target (browser vs node vs bun) and whether you care about code splitting/minify/sourcemaps, I can outline the exact settings and what files you should expect in `outdir`.
