import { Router } from 'express';
import urlController from '@/controllers/v1/url.controller';
import { authMiddleware } from '@/middlewares/auth.middlewares';
import { validateRequest } from '@/middlewares/validate-request.middlewares';
import { 
  createUrlSchema, 
  deleteUrlSchema, 
  getUrlSchema, 
  updateUrlSchema
} from '@/validations/v1/url.validations';

const router: Router = Router();

router.use(authMiddleware);
router.get('/all', urlController.allByUser);
router.post('/', validateRequest(createUrlSchema), urlController.create);
router.put('/:id', validateRequest(updateUrlSchema), urlController.update);
router.get('/:id', validateRequest(getUrlSchema), urlController.show);
router.delete('/:id', validateRequest(deleteUrlSchema), urlController.delete);

export default router;