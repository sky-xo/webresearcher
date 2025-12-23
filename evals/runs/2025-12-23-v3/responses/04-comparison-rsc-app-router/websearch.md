# Query: React Server Components vs Next.js App Router - what's the difference?

**Tool:** WebSearch
**Latency:** 2.5s

## Response

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
