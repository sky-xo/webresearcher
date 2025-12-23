# Query: What's the correct way to use React Server Actions with forms in Next.js 15?

**Tool:** webresearcher --effort medium
**Latency:** 66s

## Tokens
- Input: 26526
- Output: 3657

## Cost
$0.0976

## Response

In **Next.js 15**, the "correct" pattern is:

- Use **App Router (`/app`)** + **React Server Actions** for mutations.
- Invoke the action from a form via **`<form action={someServerAction}>`** (not `onSubmit` + `fetch`), so you get **progressive enhancement** and less client code. ([nextjs.org](https://nextjs.org/docs/guides/building-forms))
- If you're still on the **Pages Router (`/pages`)**, Next's docs still steer you toward **API Routes** for mutations (Server Actions are an App Router/RSC feature). ([nextjs.org](https://nextjs.org/docs/15/pages/building-your-application/data-fetching/forms-and-mutations?utm_source=openai))

## 1) The basic / recommended form + Server Action (Server Component)

```tsx
// app/invoices/page.tsx (Server Component)
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function Page() {
  async function createInvoice(formData: FormData) {
    "use server";

    const customerId = formData.get("customerId");
    const amount = formData.get("amount");

    // validate + mutate (DB write, etc.)

    revalidatePath("/invoices");
    redirect("/invoices");
  }

  return (
    <form action={createInvoice}>
      <input name="customerId" />
      <input name="amount" />
      <button type="submit">Create</button>
    </form>
  );
}
```

Key points:
- The Server Action is an **async** function with `"use server"`.
- When used as a form `action`, it automatically receives **`FormData`**. ([nextjs.org](https://nextjs.org/docs/guides/building-forms))
- For many fields, `Object.fromEntries(formData)` is convenient—but be aware it can include extra `$ACTION_` fields. ([nextjs.org](https://nextjs.org/docs/guides/building-forms))

## 2) Showing validation errors / pending UI (Client Component + `useActionState`)

When you need to render returned error messages or state, make the form component a **Client Component** and use **`useActionState`**. Next's guide also notes the action signature changes to include `prevState/initialState` first. ([nextjs.org](https://nextjs.org/docs/guides/building-forms))

```tsx
// app/actions.ts
"use server";

export async function createUser(
  prevState: { message: string },
  formData: FormData
) {
  const email = String(formData.get("email") ?? "");

  if (!email.includes("@")) {
    return { message: "Please enter a valid email." };
  }

  // mutate...
  return { message: "Created!" };
}
```

```tsx
// app/ui/signup.tsx
"use client";

import { useActionState } from "react";
import { createUser } from "../actions";

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, {
    message: "",
  });

  return (
    <form action={formAction}>
      <input name="email" />
      <button disabled={pending} type="submit">Sign up</button>
      <p aria-live="polite">{state.message}</p>
    </form>
  );
}
```

## 3) Pending state in a nested submit button (`useFormStatus`)

If you want the submit button to live in a separate component, use **`useFormStatus`** from `react-dom`. ([nextjs.org](https://nextjs.org/docs/guides/building-forms))

```tsx
"use client";
import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>Submit</button>;
}
```

## 4) Passing extra arguments (don't cram everything into hidden inputs)

To pass a non-form value (like `userId`) alongside `FormData`, bind it:

```tsx
const updateUserWithId = updateUser.bind(null, userId);
return <form action={updateUserWithId}>...</form>;
```

This works in Server + Client Components and still supports progressive enhancement. ([nextjs.org](https://nextjs.org/docs/guides/building-forms))

## 5) Multiple submit buttons → use `formAction`

If one form has multiple "submit intents" (e.g. Save vs Delete), keep the form but attach different actions to buttons via `formAction`. ([nextjs.org](https://nextjs.org/docs/13/app/api-reference/functions/server-actions))

## 6) Security footnote (important in Next 15)

Treat Server Actions as **public HTTP endpoints**. Next 15 added hardening like secure/unguessable action IDs and dead-code elimination for unused actions, but you still need to do authz/validation yourself. ([nextjs.org](https://nextjs.org/blog/next-15?utm_source=openai))
If you're behind a proxy or need to allow extra origins, configure `experimental.serverActions.allowedOrigins`, and be aware of the request body size limit options. ([nextjs.org](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions))

---

If you tell me whether you're using **App Router or Pages Router**, and whether you need **field-level validation errors** or **optimistic UI**, I can tailor the exact structure (folder layout + action signatures) to your setup.
