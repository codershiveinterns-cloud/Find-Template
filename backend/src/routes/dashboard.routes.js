import { Router } from 'express';
import { getOverview, getChartData } from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireModuleAccess } from '../middleware/role.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/overview', requireModuleAccess('overview'), getOverview);
router.get('/chart-data', requireModuleAccess('overview'), getChartData);

export default router;
