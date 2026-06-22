import { Router } from 'express';
import { getServices } from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireModuleAccess } from '../middleware/role.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', requireModuleAccess('services'), getServices);

export default router;
