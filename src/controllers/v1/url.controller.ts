import { StatusCode } from '@/constants/status-code.constants';
import { catchAsync } from '@/utils/catch-async.utils';
import { Request, Response } from 'express';
import UrlService from '@/services/v1/url.service';

export class UrlController {
  create = catchAsync(async (req: Request, res: Response) => {
    const { originalUrl } = req.body;

    const url = await UrlService.create(originalUrl);

    res.status(StatusCode.CREATED).json({
      message: 'URL criada com sucesso.',
      data: url,
    });
  });

  show = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const url = await UrlService.show(Number(id));

    res.status(StatusCode.OK).json({
      message: 'URL encontrada com sucesso.',
      data: url,
    });
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    await UrlService.delete(Number(id));

    res.status(StatusCode.OK).json({
      message: 'URL deletada com sucesso.',
    });
  });

  allByUser = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const urls = await UrlService.allByUser(Number(userId));

    res.status(StatusCode.OK).json({
      message: 'URLs encontradas com sucesso.',
      data: urls,
    });
  });
}

export default new UrlController();
