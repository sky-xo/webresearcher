# Query 14: What's the correct way to use React Server Actions with forms in Next.js 15?

**Type:** docs

## Response A (WebSearch)

### Basic Usage
React extends `<form>` to allow Server Actions via `action` attribute.

```tsx
export default function Page() {
  async function createInvoice(formData: FormData) {
    'use server'
    const rawFormData = { customerId: formData.get('customerId') }
  }
  return <form action={createInvoice}>...</form>
}
```

### Using `useActionState`
```tsx
'use client'
import { useActionState } from 'react'

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, initialState)
  return (
    <form action={formAction}>
      <input name="email" />
      <button disabled={pending}>Sign up</button>
    </form>
  )
}
```

### Key Features
1. Progressive Enhancement
2. Cache Revalidation with `revalidatePath` and `redirect`
3. Next.js Form Component

## Response B (webresearcher)

In **Next.js 15 + React 19**, the pattern is:
1) Define Server Action with `'use server'`
2) Pass to `<form action={...}>`
3) For pending/error UI, use `useActionState` / `useFormStatus`

## 1) Server Component form (simplest)
```tsx
import { createInvoice } from '@/app/actions'
export default function Page() {
  return <form action={createInvoice}>...
}
```

## 2) Passing extra arguments (use `.bind`)
```tsx
const updateUserWithId = updateUser.bind(null, userId)
return <form action={updateUserWithId}>
```

## 3) Client Component with `useActionState`
```tsx
const [state, formAction, pending] = useActionState(createUser, initialState)
```

## 4) Pending state via `useFormStatus`
```tsx
import { useFormStatus } from 'react-dom'
export function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>Submit</button>
}
```

## 5) Multiple submit buttons = multiple actions
```tsx
<form>
  <button formAction={saveDraft}>Save draft</button>
  <button formAction={publish}>Publish</button>
</form>
```

## 6) Security notes
- Treat Server Actions as public HTTP endpoints: validate inputs
- Next.js 15 introduced secure/non-deterministic action IDs

## Judgment

**Winner:** B (webresearcher)
**Reasoning:** Response B is more comprehensive, covering all essential patterns including argument binding, `useFormStatus`, and multiple submit buttons. It also includes critical security guidance about treating Server Actions as public endpoints, which is essential for Next.js 15.

## Metrics

| Metric | webresearcher | WebSearch |
|--------|---------------|-----------|
| Latency | 72570ms | ~3000ms |
