import { Router } from 'express';
import { createProject, deleteProject, getProject, listProjects, updateProject, updateProjectStatus } from '../controllers/project.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireModuleAccess, requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { projectSchema, projectStatusSchema } from '../validators/project.validator.js';

const router = Router();

router.use(requireAuth);
router.get('/', requireModuleAccess('projects', 'developer', 'designer'), listProjects);
router.post('/', requireRole('admin'), requireModuleAccess('projects'), validate(projectSchema), createProject);
router.get('/:id', requireModuleAccess('projects', 'developer', 'designer'), getProject);
router.patch('/:id/status', requireModuleAccess('projects', 'developer', 'designer'), validate(projectStatusSchema), updateProjectStatus);
router.put('/:id', requireRole('admin'), requireModuleAccess('projects'), validate(projectSchema), updateProject);
router.delete('/:id', requireRole('admin'), requireModuleAccess('projects'), deleteProject);

export default router;
