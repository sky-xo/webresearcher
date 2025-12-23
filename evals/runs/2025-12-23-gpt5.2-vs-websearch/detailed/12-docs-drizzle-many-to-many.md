# Query 12: How do I define a many-to-many relation in Drizzle ORM?

**Type:** docs

## Response A (webresearcher)

Drizzle doesn't have a "magic" many-to-many field type—you model many-to-many by creating an explicit junction table.

## 1) Define the two main tables + the junction table

```ts
import { pgTable, serial, integer, text, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
});

export const usersToGroups = pgTable(
  "users_to_groups",
  {
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    groupId: integer("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.groupId] }) })
);
```

## 2) Define relations

[Shows complete relations for users, groups, and junction table]

## 3) Querying

```ts
const result = await db.query.users.findMany({
  with: {
    usersToGroups: { with: { group: true } },
  },
});

// Flatten if needed:
const usersWithGroups = result.map((u) => ({
  ...u,
  groups: u.usersToGroups.map((j) => j.group),
}));
```

## Response B (WebSearch)

In Drizzle ORM, many-to-many relationships require a junction table.

[Shows similar schema definition]

## Key Points
1. Composite primary key ensures uniqueness
2. You must provide relation objects for both tables
3. You'll need to go through the junction table in queries

## Judgment

**Winner:** A (webresearcher)
**Reasoning:** Response A is more complete and actionable. It includes the full relations code and provides concrete querying examples with code showing how to actually use the relationship. Response B mentions "You'll need to go through the junction table in queries" but doesn't demonstrate how.

## Metrics

| Metric | webresearcher | WebSearch |
|--------|---------------|-----------|
| Latency | 32771ms | ~2500ms |
