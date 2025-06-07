import { Router } from 'express';
import urlController from '@/controllers/v1/url.controller';
import { authMiddleware } from '@/middlewares/auth.middlewares';
import { validateRequest } from '@/middlewares/validate-request.middlewares';
import { 
  createUrlSchema, 
  deleteUrlSchema, 
  getUrlSchema, 
  getUserUrlsSchema 
} from '@/validations/v1/url.validations';

const router: Router = Router();

router.use(authMiddleware);
router.post('/', validateRequest(createUrlSchema), urlController.create);
router.get('/:id', validateRequest(getUrlSchema), urlController.show);
router.delete('/:id', validateRequest(deleteUrlSchema), urlController.delete);
router.get('/user/:userId', validateRequest(getUserUrlsSchema), urlController.allByUser);

export default router;