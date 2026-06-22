import { Router } from 'express';
import {
  createTeamMember,
  deleteTeamMember,
  getTeamMember,
  listTeamMembers,
  updateTeamMember,
} from '../controllers/team.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireModuleAccess, requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createTeamMemberSchema, updateTeamMemberSchema } from '../validators/team.validator.js';

const router = Router();

router.use(requireAuth);
router.get('/', requireModuleAccess('teams'), listTeamMembers);
router.post('/', requireRole('admin'), requireModuleAccess('teams'), validate(createTeamMemberSchema), createTeamMember);
router.get('/:id', requireModuleAccess('teams'), getTeamMember);
router.put('/:id', requireRole('admin'), requireModuleAccess('teams'), validate(updateTeamMemberSchema), updateTeamMember);
router.delete('/:id', requireRole('admin'), requireModuleAccess('teams'), deleteTeamMember);

export default router;
