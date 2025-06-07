import urlRepository from '@/repositories/v1/url.repository';
import { CreateUrlModel, UpdateUrlModel } from '@/types/models/v1/url.types';
import { NotFoundError } from '@/utils/app-error.utils';

export class UrlService {
  async create(urlData: Omit<CreateUrlModel, 'shortCode'>) {
    const shortCode = Math.random().toString(36).substring(2, 8);

    const url = await urlRepository.create({
      ...urlData,
      shortCode,
    });

    return url;
  }

  async update(id: number, urlData: UpdateUrlModel) {
    const url = await urlRepository.update(id, urlData);

    return url;
  }

  async show(id: number) {
    const url = await urlRepository.findById(id);

    return url;
  }

  async delete(id: number) {
    await urlRepository.delete(id);
  }

  async allByUser(userId: number) {
    const urls = await urlRepository.findAllByUserId(userId);

    return urls;
  }

  async redirectByShortCode(shortCode: string) {
    const url = await urlRepository.findByShortCode(shortCode);

    if (!url.isActive) {
      throw new NotFoundError('URL não encontrada ou desativada.');
    }

    await urlRepository.incrementClicks(url.id);

    return url.originalUrl;
  }
}

export default new UrlService();
