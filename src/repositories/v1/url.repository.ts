import { url } from '@/db/schema/v1/url.schema';
import { db } from '@/db/db.connection';
import { CreateUrlModel, UrlModel } from '@/types/models/v1/url.types';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '@/utils/app-error.utils';

class UrlRepository {
  async create(urlData: CreateUrlModel) {
    const [newUrl] = await db.insert(url).values(urlData).returning();

    return newUrl;
  }

  async findById(id: number): Promise<UrlModel> {
    const urlResults = await db
      .select()
      .from(url)
      .where(eq(url.id, id))
      .limit(1);

    if (!urlResults[0]) {
      throw new NotFoundError('URL não encontrada');
    }

    return urlResults[0];
  }

  async findAllByUserId(userId: number): Promise<UrlModel[]> {
    const urls = await db.select().from(url).where(eq(url.userId, userId));

    return urls;
  }

  async delete(id: number): Promise<boolean> {
    const urlResults = await db.delete(url).where(eq(url.id, id)).returning();

    if (!urlResults[0]) {
      throw new NotFoundError('URL não encontrada');
    }

    return true;
  }

  async update(
    id: number,
    urlData: Partial<CreateUrlModel>
  ): Promise<UrlModel> {
    const [updatedUrl] = await db
      .update(url)
      .set(urlData)
      .where(eq(url.id, id))
      .returning();

    if (!updatedUrl) {
      throw new NotFoundError('URL não encontrada');
    }

    return updatedUrl;
  }
}

export default new UrlRepository();
