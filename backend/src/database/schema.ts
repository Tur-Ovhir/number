import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

const users = pgTable("users", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  name: text("name").notNull(),
  password: text("password").notNull(),
});

const numbers = pgTable("numbers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  userName: text("user_name").notNull(),
  number: text("number").notNull(),
  name: text("name").notNull(),
});

export { users, numbers };
