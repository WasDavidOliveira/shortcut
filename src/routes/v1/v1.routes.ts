import { Router } from 'express';
import authRoutes from '@/routes/v1/auth.routes';
import permissionRoutes from '@/routes/v1/permission.routes';
import { authMiddleware } from '@/middlewares/auth.middlewares';
import rolePermissionRoutes from '@/routes/v1/role-permission.routes';
import roleRoutes from '@/routes/v1/roles.routes';
import urlRoutes from '@/routes/v1/url.routes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/permissions', authMiddleware, permissionRoutes);
router.use('/roles', authMiddleware, roleRoutes);
router.use('/roles-permissions', authMiddleware, rolePermissionRoutes);
router.use('/urls', authMiddleware, urlRoutes);

export default router;
