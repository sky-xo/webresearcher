# Query: What's the correct way to use React Server Actions with forms in Next.js 15?

**Tool:** WebSearch
**Latency:** 3.0s

## Response

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
