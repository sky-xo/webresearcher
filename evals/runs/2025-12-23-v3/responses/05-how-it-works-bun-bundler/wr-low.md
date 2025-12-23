# Query: How does Bun's bundler work?

**Tool:** webresearcher --effort low
**Latency:** 19s

## Tokens
- Input: 8311
- Output: 1169

## Cost
$0.0309

## Response

Bun's bundler is essentially a fast, single-pass "parse → resolve → transform → link → emit" pipeline that's tightly integrated with Bun's runtime resolver and its built-in JS/TS/JSX transpiler.

## 1) Entry points → module graph
When you run `bun build` (or call `Bun.build()`), Bun starts from one or more **entrypoints** and recursively follows `import`/`require` statements to build a **dependency graph**.

### Resolution (how imports map to files)
For each import, the bundler:
- Applies **plugin `onResolve` hooks** first (if present), which can redirect/virtualize paths. ([bun.com](https://bun.com/docs/bundler/plugins?utm_source=openai))
- Otherwise resolves using Bun's normal resolution rules (including package `"exports"` conditions influenced by `target`). The docs describe `target: "browser"` vs `target: "bun"` and how that affects resolution/behavior. ([bun.com](https://bun.com/docs/bundler?utm_source=openai))

## 2) Loading modules (file types / loaders)
Once a path is resolved, the bundler decides how to **load** it:
- Built-in loaders cover JS/TS/JSX, JSON/JSONC/TOML/YAML, text, HTML, CSS, WASM, `.node`, etc. ([bun.com](https://bun.com/docs/bundler?utm_source=openai))
- Plugins can intercept with **`onLoad`** to provide custom contents/loader (e.g., compile SASS, load virtual modules). ([bun.com](https://bun.com/docs/bundler/plugins?utm_source=openai))

Notable behavior:
- JS/TS/TSX/JSX are parsed by Bun's transpiler and then transformed (see next section). ([bun.com](https://bun.com/docs/bundler?utm_source=openai))
- Many non-JS files are **inlined** (e.g., JSON → object, text → string) or handled as **assets** depending on type/extension. ([bun.com](https://bun.com/docs/bundler?utm_source=openai))

## 3) Parse + transforms (what "bundling" changes)
For JavaScript-like inputs, Bun parses and applies a default set of compiler-style transforms, including:
- **Tree shaking** (remove unused exports/imports)
- **Dead code elimination** ([bun.com](https://bun.com/docs/bundler?utm_source=openai))

One important detail: Bun currently does **not** aim to "downlevel" new JS syntax to older targets; newer syntax you write generally remains in the output (so browser compatibility is your responsibility). ([bun.com](https://bun.com/docs/bundler?utm_source=openai))

## 4) Linking, chunking, and output formats
After the graph is built and modules are transformed, Bun "links" everything together into output files:
- Bun "bundles by default" (no need for a `--bundle` flag like esbuild). ([bun.com](https://bun.com/docs/bundler/vs-esbuild?utm_source=openai))
- It can emit **ESM** or **CJS** output formats (per the CLI/API options). ([bun.com](https://bun.com/docs/bundler/vs-esbuild?utm_source=openai))
- CSS can be bundled into a single output CSS file when imported. ([bun.com](https://bun.com/docs/bundler?utm_source=openai))
- HTML entrypoints/imports can cause referenced assets to be discovered and bundled. ([bun.com](https://bun.com/docs/bundler?utm_source=openai))

## 5) Targets: "browser" vs "bun" (and the `// @bun` pragma)
A key design point is that Bun can bundle for different execution environments:
- `target: "browser"`: prioritizes `"browser"` conditions; Node built-ins may resolve but aren't necessarily usable at runtime in a browser. ([bun.com](https://bun.com/docs/bundler?utm_source=openai))
- `target: "bun"`: meant to run under Bun; Bun/Node APIs are allowed and left as-is, and the output is marked with a **`// @bun` pragma** so the Bun runtime can skip re-transpiling it. ([bun.com](https://bun.com/docs/bundler?utm_source=openai))

## 6) Plugin hooks (where you "tap into" the pipeline)
Bun's bundler plugin model is intentionally similar to esbuild's:
- `onResolve`: customize how specifiers resolve
- `onLoad`: customize how file contents are provided/transformed
- plus lifecycle hooks like `onStart` and (notably) `onBeforeParse` for native addons in the parser thread ([bun.com](https://bun.com/docs/bundler/plugins?utm_source=openai))

---

If you tell me your use case (browser app vs server bundle vs library; need code-splitting; need CSS extraction; need custom file types), I can describe the exact stages/options Bun will use and what the emitted output typically looks like.
