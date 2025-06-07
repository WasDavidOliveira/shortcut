import { db } from '@/db/db.connection';
import { NotFoundError } from '@/utils/app-error.utils';
import { url } from '@/db/schema/v1/url.schema';
import { UrlResource } from '@/resources/v1/url.resource';

export class UrlService {
  async create(originalUrl: string) {
    const url = await db
      .insert(url)
      .values({
        originalUrl,
      })
      .returning();

    return url;
  }

  async show(id: number) {
    const url = await db.select().from(url).where(eq(url.id, id));

    return url;
  }

  async delete(id: number) {
    await db.delete(url).where(eq(url.id, id));
  }

  async allByUser(userId: number) {
    const urls = await db.select().from(url).where(eq(url.userId, userId));
    return urls;
  }
}

export default new UrlService();
