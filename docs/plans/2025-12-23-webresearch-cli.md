# webresearcher CLI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a CLI called `webresearcher` that queries GPT-5.2 with web search for up-to-date research answers.

**Architecture:** Single TypeScript file using OpenAI's Responses API with the `web_search` tool. Bun for runtime and package management. Global install via `bun link`.

**Tech Stack:** Bun, TypeScript, OpenAI SDK (openai package)

---

### Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`

**Step 1: Initialize package.json**

```json
{
  "name": "webresearcher",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "webresearcher": "./src/index.ts"
  },
  "dependencies": {
    "openai": "^5"
  }
}
```

**Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "types": ["bun-types"]
  }
}
```

**Step 3: Install dependencies**

Run: `bun install`
Expected: Packages installed, `bun.lockb` created

**Step 4: Commit**

```bash
git init
git add package.json tsconfig.json bun.lockb
git commit -m "chore: initialize project with bun and openai dependency"
```

---

### Task 2: CLI Entry Point with Argument Parsing

**Files:**
- Create: `src/index.ts`

**Step 1: Create CLI with argument parsing**

```typescript
#!/usr/bin/env bun

const args = process.argv.slice(2);

// Parse --effort flag
let effort: "low" | "medium" | "high" = "medium";
const effortIndex = args.indexOf("--effort");
if (effortIndex !== -1) {
  const value = args[effortIndex + 1];
  if (value === "low" || value === "medium" || value === "high") {
    effort = value;
    args.splice(effortIndex, 2);
  } else {
    console.error("Error: --effort must be low, medium, or high");
    process.exit(1);
  }
}

// Remaining arg is the query
const query = args[0];

if (!query) {
  console.error("Usage: webresearcher [--effort low|medium|high] \"your query\"");
  process.exit(1);
}

console.log(`Query: ${query}`);
console.log(`Effort: ${effort}`);
```

**Step 2: Test argument parsing manually**

Run: `bun src/index.ts "test query"`
Expected: `Query: test query` and `Effort: medium`

Run: `bun src/index.ts --effort high "test query"`
Expected: `Query: test query` and `Effort: high`

Run: `bun src/index.ts`
Expected: Usage message and exit code 1

**Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat: add CLI entry point with argument parsing"
```

---

### Task 3: OpenAI API Integration

**Files:**
- Modify: `src/index.ts`

**Step 1: Add API key validation and OpenAI client**

Replace the console.log statements at the end of `src/index.ts` with:

```typescript
import OpenAI from "openai";

// ... existing argument parsing code ...

// Validate API key
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Error: OPENAI_API_KEY environment variable is required");
  process.exit(1);
}

// Create client and make request
const client = new OpenAI({ apiKey });

const response = await client.responses.create({
  model: "gpt-5.2",
  reasoning: { effort },
  tools: [{ type: "web_search" }],
  input: query,
});

console.log(response.output_text);
```

**Step 2: Test with a real query**

Run: `bun src/index.ts "what is the current version of bun?"`
Expected: Response with current Bun version info and citations

**Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat: integrate OpenAI Responses API with web search"
```

---

### Task 4: Global Installation

**Step 1: Link globally**

Run: `bun link`
Expected: Success message about linking webresearcher

**Step 2: Test global command**

Run: `webresearcher "test query"`
Expected: Same behavior as `bun src/index.ts "test query"`

**Step 3: Commit docs**

```bash
git add docs/
git commit -m "docs: add design and implementation plan"
```

---

### Task 5: Final Verification

**Step 1: Test the full flow**

Run: `webresearcher "what terminals are AI developers preferring currently?"`
Expected: Detailed response about terminal preferences with web citations

Run: `webresearcher --effort high "comprehensive analysis of bun vs deno in 2025"`
Expected: More thorough response (may take longer)

Run: `webresearcher --effort low "current bitcoin price"`
Expected: Quick, concise response

**Step 2: Verify error handling**

Run: `OPENAI_API_KEY= webresearcher "test"` (unset key)
Expected: Error message about missing API key

Run: `webresearcher` (no query)
Expected: Usage message

---

## Summary

Total tasks: 5
Estimated complexity: Simple
Key files: `package.json`, `tsconfig.json`, `src/index.ts`
