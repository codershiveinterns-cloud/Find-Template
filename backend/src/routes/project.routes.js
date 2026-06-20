import { Router } from 'express';
import { createProject, deleteProject, getProject, listProjects, updateProject, updateProjectStatus } from '../controllers/project.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { projectSchema, projectStatusSchema } from '../validators/project.validator.js';

const router = Router();

router.use(requireAuth);
router.get('/', requireRole('admin', 'developer', 'designer'), listProjects);
router.post('/', requireRole('admin'), validate(projectSchema), createProject);
router.get('/:id', requireRole('admin', 'developer', 'designer'), getProject);
router.patch('/:id/status', requireRole('admin', 'developer', 'designer'), validate(projectStatusSchema), updateProjectStatus);
router.put('/:id', requireRole('admin'), validate(projectSchema), updateProject);
router.delete('/:id', requireRole('admin'), deleteProject);

export default router;
