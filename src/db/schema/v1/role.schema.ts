import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from '@/db/schema/v1/user.schema';
import { rolePermissions } from './role-permission.schema';

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: varchar('description', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const roleRelations = relations(roles, ({ many }) => ({
  users: many(user),
  rolePermissions: many(rolePermissions),
}));
