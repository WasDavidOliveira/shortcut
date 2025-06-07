import { Router } from 'express';
import urlController from '@/controllers/v1/url.controller';
import { authMiddleware } from '@/middlewares/auth.middlewares';
import { validateRequest } from '@/middlewares/validate-request.middlewares';
import {
  createUrlSchema,
  deleteUrlSchema,
  getUrlSchema,
  updateUrlSchema,
} from '@/validations/v1/url.validations';
import { hasPermission } from '@/middlewares/permission.middleware';
import { PermissionActions } from '@/constants/permission.constants';

const router: Router = Router();

router.use(authMiddleware);
router.get(
  '/all',
  hasPermission('url', PermissionActions.READ),
  urlController.allByUser
);
router.post(
  '/',
  hasPermission('url', PermissionActions.CREATE),
  validateRequest(createUrlSchema),
  urlController.create
);
router.put(
  '/:id',
  hasPermission('url', PermissionActions.UPDATE),
  validateRequest(updateUrlSchema),
  urlController.update
);
router.get(
  '/:id',
  hasPermission('url', PermissionActions.READ),
  validateRequest(getUrlSchema),
  urlController.show
);
router.delete(
  '/:id',
  hasPermission('url', PermissionActions.DELETE),
  validateRequest(deleteUrlSchema),
  urlController.delete
);

export default router;
