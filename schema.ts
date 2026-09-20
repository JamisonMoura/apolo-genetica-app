import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const birdOverrides = sqliteTable("bird_overrides", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nameKey: text("name_key").notNull().unique(),
  payload: text("payload").notNull(),
  updatedAt: text("updated_at").notNull(),
});
