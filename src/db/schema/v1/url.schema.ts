import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from '@/db/schema/v1/user.schema';

export const url = pgTable('url', {
  id: serial('id').primaryKey(),
  originalUrl: varchar('original_url', { length: 255 }).notNull(),
  shortCode: varchar('short_code', { length: 255 }).notNull(),
  userId: integer('user_id').references(() => user.id),
  isActive: boolean('is_active').notNull().default(true),
  clicks: integer('clicks').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const urlRelations = relations(url, ({ one }) => ({
  user: one(user, {
    fields: [url.userId],
    references: [user.id],
  }),
}));
