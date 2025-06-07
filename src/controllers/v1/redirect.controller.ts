import { StatusCode } from '@/constants/status-code.constants';
import { catchAsync } from '@/utils/catch-async.utils';
import { Request, Response } from 'express';
import UrlService from '@/services/v1/url.service';

export class RedirectController {
  redirect = catchAsync(async (req: Request, res: Response) => {
    const { shortCode } = req.params;

    const originalUrl = await UrlService.redirectByShortCode(shortCode);

    res.redirect(StatusCode.MOVED_PERMANENTLY, originalUrl);
  });
}

export default new RedirectController();
