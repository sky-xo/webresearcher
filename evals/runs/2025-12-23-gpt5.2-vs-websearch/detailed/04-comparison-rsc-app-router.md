# Query 4: React Server Components vs Next.js App Router - what's the difference?

**Type:** comparison

## Response A (webresearcher)

## 1) React Server Components (RSC) = a React capability (the "what")
**RSC is a React feature/architecture** that lets you build a component tree where:
- **Server Components** render on the server and their code never ships to the browser
- **Client Components** render/hydrate in the browser

Key mental model: **RSC answers:** "Which components run where, and what gets shipped to the browser?"

## 2) Next.js App Router = a Next.js framework feature built around RSC (the "how")
**The App Router is Next.js's routing + rendering system** (the `app/` directory) that uses RSC as a foundation and adds:
- File-based routing
- Nested layouts
- Loading / error / not-found UI conventions
- Route handlers for server endpoints
- Metadata API for SEO/head management

Key mental model: **App Router answers:** "How do I structure an application using RSC in Next.js?"

## 3) Relationship in one sentence
**RSC is a React capability; Next.js App Router is a Next.js routing/rendering framework that implements and operationalizes RSC for real apps.**

## Response B (WebSearch)

## Key Distinction
React Server Components act as a spec for components working across compatible React frameworks.
Next.js 13+ introduced the App Router with support for React Server Components.

## React Server Components (RSC)
Server Components run only on the server and have zero impact on bundle-size.

## Next.js App Router
The App Router is a routing system built on top of RSCs with nested routes, layouts, loading states, error handling.

## How They Work Together
Next.js App Router is basically a synonym for React Server Components and Streaming at the moment.
There's only one way to start using React Server Components, and that's with Next.js 13.4+.

## Judgment

**Winner:** A (webresearcher)
**Reasoning:** Response A provides a clearer mental model by explicitly framing RSC as the "what" and App Router as the "how". It's more accurate - Response B contains inaccuracies like "There's only one way to start using React Server Components" which isn't true anymore.

## Metrics

| Metric | webresearcher | WebSearch |
|--------|---------------|-----------|
| Latency | 31464ms | ~2500ms |
