# Query: How do I define a many-to-many relation in Drizzle ORM?

**Tool:** webresearcher --effort medium
**Latency:** 19s

## Tokens
- Input: 8447
- Output: 1149

## Cost
$0.0309

## Response

In Drizzle you model **many-to-many** by introducing an explicit **junction (join) table** that holds the two foreign keys (and optionally extra columns like `createdAt`, `role`, etc.). ([orm.drizzle.team](https://orm.drizzle.team/docs/relations-v2?utm_source=openai))

Below are the two common ways depending on which Relations API you're using.

---

## Relational Queries **v2** (recommended): `defineRelations(...).through(...)`

### 1) Define the 3 tables (example: Postgres)
```ts
import { pgTable, integer, text, primaryKey } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey(),
  name: text(),
});

export const groups = pgTable("groups", {
  id: integer().primaryKey(),
  name: text(),
});

export const usersToGroups = pgTable(
  "users_to_groups",
  {
    userId: integer("user_id").notNull().references(() => users.id),
    groupId: integer("group_id").notNull().references(() => groups.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.groupId] })],
);
```

### 2) Define the many-to-many relation using `through(...)`
```ts
import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    groups: r.many.groups({
      from: r.users.id.through(r.usersToGroups.userId),
      to: r.groups.id.through(r.usersToGroups.groupId),
    }),
  },
  groups: {
    users: r.many.users(),
  },
}));
```
This `through(...)` form lets you fetch `users -> groups` directly without selecting the junction rows yourself. ([orm.drizzle.team](https://orm.drizzle.team/docs/relations-v2?utm_source=openai))

### 3) Query
```ts
const result = await db.query.users.findMany({
  with: { groups: true },
});
```
([orm.drizzle.team](https://orm.drizzle.team/docs/relations-v1-v2?utm_source=openai))

---

## Relations **v1 / classic**: `relations(...)` + junction relations

You still create a junction table, then:
- `users` has `many(usersToGroups)`
- `groups` has `many(usersToGroups)`
- `usersToGroups` has `one(users)` and `one(groups)`
- when querying, you typically "walk through" the junction table

This is the general approach shown in the v1 relations docs. ([orm.drizzle.team](https://orm.drizzle.team/docs/relations?utm_source=openai))

---

If you tell me which database you're using (Postgres / MySQL / SQLite) and whether you're on **Relations v2** already, I can tailor the exact imports + schema style to your setup.
