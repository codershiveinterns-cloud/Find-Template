import { Router } from 'express';
import { getOverview, getChartData } from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(requireAuth, requireRole('admin'));
router.get('/overview', getOverview);
router.get('/chart-data', getChartData);

export default router;
