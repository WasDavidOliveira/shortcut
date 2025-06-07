import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { url } from '@/db/schema/v1/url.schema';

export type UrlModel = InferSelectModel<typeof url>;
export type CreateUrlModel = InferInsertModel<typeof url>;
export type UpdateUrlModel = Partial<CreateUrlModel>;