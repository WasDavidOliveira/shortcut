import { StatusCode } from '@/constants/status-code.constants';
import { catchAsync } from '@/utils/catch-async.utils';
import { Request, Response } from 'express';
import UrlService from '@/services/v1/url.service';
import {
  UpdateUrlInput,
  CreateUrlInput,
} from '@/validations/v1/url.validations';

export class UrlController {
  allByUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;

    const urls = await UrlService.allByUser(Number(userId));

    res.status(StatusCode.OK).json({
      message: 'URLs encontradas com sucesso.',
      data: urls,
    });
  });

  create = catchAsync(async (req: Request, res: Response) => {
    const createUrlInput: CreateUrlInput['body'] = req.body;

    const url = await UrlService.create(createUrlInput);

    res.status(StatusCode.CREATED).json({
      message: 'URL criada com sucesso.',
      data: url,
    });
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateUrlInput: UpdateUrlInput['body'] = req.body;

    const url = await UrlService.update(Number(id), updateUrlInput);

    res.status(StatusCode.OK).json({
      message: 'URL atualizada com sucesso.',
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
}

export default new UrlController();
