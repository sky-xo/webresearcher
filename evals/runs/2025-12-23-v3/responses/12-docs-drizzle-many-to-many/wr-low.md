# Query: How do I define a many-to-many relation in Drizzle ORM?

**Tool:** webresearcher --effort low
**Latency:** 12s

## Tokens
- Input: 4440
- Output: 762

## Cost
$0.0184

## Response

Drizzle doesn't have a "many-to-many" field type. You model it explicitly with a **join (junction) table** that has two foreign keys, then describe relations via `relations()`.

Below is the typical pattern.

## 1) Define the two main tables
Example (PostgreSQL; same idea for MySQL/SQLite—types differ slightly):

```ts
import { pgTable, serial, integer, text, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});
```

## 2) Create the junction table
Make the pair `(userId, groupId)` unique—most commonly as a **composite primary key**.

```ts
export const usersToGroups = pgTable(
  "users_to_groups",
  {
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    groupId: integer("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.groupId] }),
  }),
);
```

## 3) Declare relations for all three tables
You relate each "side" to the junction table, and the junction table back to each side.

```ts
export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(usersToGroups),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  memberships: many(usersToGroups),
}));

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
}));
```

## 4) Querying (include "through" the junction)
Drizzle's relational queries typically load via the junction table:

```ts
const result = await db.query.users.findMany({
  with: {
    memberships: {
      with: {
        group: true,
      },
    },
  },
});
```

That yields something like:

```ts
// user.memberships[].group
```

If you want a flatter `user.groups[]` shape, you usually map it in JS:

```ts
const usersWithGroups = result.map((u) => ({
  ...u,
  groups: u.memberships.map((m) => m.group),
}));
```

## 5) Inserting into the many-to-many
Insert rows into the junction table:

```ts
await db.insert(usersToGroups).values([
  { userId: 1, groupId: 10 },
  { userId: 1, groupId: 11 },
]);
```

---

If you tell me which driver you're using (Postgres/MySQL/SQLite) and your entities (e.g., `posts`↔`tags`), I can tailor the exact table definitions and query shape.
