# Query: What's the correct way to use React Server Actions with forms in Next.js 15?

**Tool:** webresearcher --effort low
**Latency:** 25s

## Tokens
- Input: 8520
- Output: 1362

## Cost
$0.0340

## Response

In Next.js 15 (App Router), the "correct" pattern is:

1) **Define a Server Action** (a server-only async function marked with `"use server"`), and
2) **Pass it to a form via the `action` prop** (or to a submit button via `formAction`). When used this way, React/Next will call your action with a **native `FormData`** object. ([nextjs.org](https://nextjs.org/learn/dashboard-app/mutating-data?utm_source=openai))

Below are the common, recommended setups.

---

## 1) Simplest: Server Component + inline Server Action (progressive enhancement)

```tsx
// app/profile/page.tsx (Server Component by default)
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function Page() {
  async function updateProfile(formData: FormData) {
    "use server";

    const name = String(formData.get("name") ?? "").trim();
    if (!name) return; // or throw / return an error object

    // ...mutate data (DB, API, etc.)

    revalidatePath("/profile");
    redirect("/profile");
  }

  return (
    <form action={updateProfile}>
      <label>
        Name <input name="name" />
      </label>
      <button type="submit">Save</button>
    </form>
  );
}
```

Passing the action directly to `<form action={...}>` gives **progressive enhancement** (it can submit even before client JS loads). ([nextjs.org](https://nextjs.org/learn/dashboard-app/mutating-data?utm_source=openai))

---

## 2) Client Component form: put Server Actions in a separate `"use server"` file

If your form component is a **Client Component** (`"use client"`), don't inline the action there. Instead, export the action from a server file:

```ts
// app/actions.ts
"use server";

export async function updateProfile(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { error: "Name is required." };
  }
  // ...mutate data...
  return { error: null };
}
```

```tsx
// app/profile/ProfileForm.tsx
"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/actions";

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState(updateProfile, {
    error: null as string | null,
  });

  return (
    <form action={formAction}>
      <input name="name" disabled={isPending} />
      <button type="submit" disabled={isPending}>
        Save
      </button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}
```

Key points:
- Use **`useActionState`** (React 19+) for "submit → get last result + pending state". ([react.dev](https://react.dev/reference/react/useActionState?utm_source=openai))
- In older examples you may see `useFormState`—React moved this to `useActionState`. ([react.dev](https://react.dev/reference/react/useActionState?utm_source=openai))
- Next.js explicitly recommends exporting server functions from a dedicated `"use server"` file when calling them from Client Components. ([nextjs.org](https://nextjs.org/docs/app/api-reference/directives/use-server?utm_source=openai))

---

## 3) Loading UI inside the form: `useFormStatus`

If you want a submit button that automatically reflects the form's pending state, render a child component inside the form and call `useFormStatus()`:

```tsx
"use client";

import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </button>
  );
}
```

`useFormStatus` only works **inside** the form subtree. ([react.dev](https://react.dev/reference/react-dom/hooks/useFormStatus?utm_source=openai))

---

## 4) A few "gotchas" that are considered best practice in Next 15

- **Treat actions like public endpoints** (validate input + authorize inside the action). Next 15 also tightened Server Actions security (e.g., secure IDs, dead code elimination), but you still must code defensively. ([nextjs.org](https://nextjs.org/blog/next-15?utm_source=openai))
- **Expect `FormData`** when invoked from `<form action={...}>` and read values with `formData.get(...)`. ([nextjs.org](https://nextjs.org/learn/dashboard-app/mutating-data?utm_source=openai))
- **If you need to update cached pages/data**, call `revalidatePath`/`revalidateTag` after the mutation. ([nextjs.org](https://nextjs.org/learn/dashboard-app/mutating-data?utm_source=openai))
- **Payload limit**: Server Actions have a default request body size limit (documented as 1MB), configurable in Next config. ([nextjs.org](https://nextjs.org/docs/13/app/api-reference/functions/server-actions?utm_source=openai))

---

If you show me a small snippet of your current form (Server vs Client component, and what you want for validation/errors), I can rewrite it into the "canonical" Next.js 15 pattern.
