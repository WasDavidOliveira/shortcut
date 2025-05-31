import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { roles } from '@/db/schema/v1/role.schema';
import { relations } from 'drizzle-orm';

export const user = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  roleId: integer('role_id')
    .references(() => roles.id)
    .notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userRelations = relations(user, ({ one }) => ({
  role: one(roles, {
    fields: [user.roleId],
    references: [roles.id],
  }),
}));
