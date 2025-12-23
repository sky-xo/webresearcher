# Query: React Server Components vs Next.js App Router - what's the difference?

**Tool:** webresearcher --effort low
**Latency:** 17s

## Tokens
- Input: 4439
- Output: 781

## Cost
$0.0187

## Response

React Server Components (RSC) are a **React feature** (a rendering model + component type). Next.js App Router is a **Next.js framework layer** that **uses RSC by default** and adds routing, data fetching conventions, bundling, streaming, and deployment integration. They overlap, but they aren't the same thing.

## 1) What React Server Components are
**RSC = components that render on the server and don't ship their code to the browser.**

Key properties:
- **Run on the server** (can read the filesystem, call databases, use server-only secrets).
- **Zero client JS** for those components (unless you explicitly mark something as a Client Component).
- Can **compose with Client Components** (server renders the tree, client components hydrate where needed).
- The output is not HTML-only; it's a special streamed "component payload" that React uses to build the UI.

Think of RSC as: **a capability in React** for splitting your component tree into *server-only* and *client-interactive* parts.

## 2) What Next.js App Router is
**App Router = Next.js' routing + rendering system (the `app/` directory) built around RSC.**

It provides:
- **File-system routing** (`app/.../page.tsx`, layouts, nested routes).
- **Layouts & nested UI** (persistent layouts, loading states, error boundaries via conventions).
- **Data fetching patterns** ("fetch in server components", caching, revalidation, streaming).
- **Route handlers** (`app/api/.../route.ts`) and server actions (Next-specific ergonomics).
- **Build tooling**: bundling, server/client boundary handling, code-splitting, deployment adapters.

So App Router is: **a full framework architecture** that happens to use RSC as its default component model.

## 3) How they relate (quick mental model)
- **RSC is the engine feature**
- **App Router is the car built around that engine**

Next App Router decides:
- *Which files are server vs client by default* (server by default; client when you add `"use client"`).
- *How routes map to server rendering, streaming, caching, and deployments.*
- *How to integrate mutations (Server Actions), API routes, middleware, etc.*

## 4) Practical differences you feel day-to-day

### Server vs client defaults
- In **App Router**, components are **Server Components by default**.
- You opt into browser interactivity with `"use client"` at the top of a file.

### Routing and conventions
- RSC alone doesn't define routing.
- App Router gives you **layouts**, **loading.tsx**, **error.tsx**, **not-found.tsx**, parallel routes, etc.

### Data fetching & caching behavior
- RSC (React) doesn't prescribe Next's caching semantics.
- Next adds default caching/revalidation behaviors on `fetch`, plus route segment config, etc.

### Mutations / form handling
- RSC alone doesn't give you "Server Actions" as a framework feature.
- Next provides **Server Actions** as a first-class mechanism (tied to its compiler/runtime).

## 5) Common misconception
> "If I'm using App Router, I'm just using React Server Components directly."

You're using **React Server Components through Next.js' implementation and conventions**. The underlying model is React's, but the developer experience (routing, caching knobs, actions, deployment) is Next's.

---

If you tell me what you're building (e.g., marketing site, dashboard, ecommerce) and whether you need SSR/SEO, auth, and heavy client-side interactivity, I can suggest a good split of Server vs Client Components and an App Router structure.
