import { Router } from 'express';
import redirectController from '@/controllers/v1/redirect.controller';

const router: Router = Router();

router.get('/:shortCode', redirectController.redirect);

export default router;
