import { Router } from 'express';
import {
  createTeamMember,
  deleteTeamMember,
  getTeamMember,
  listTeamMembers,
  updateTeamMember,
} from '../controllers/team.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createTeamMemberSchema, updateTeamMemberSchema } from '../validators/team.validator.js';

const router = Router();

router.use(requireAuth, requireRole('admin'));
router.get('/', listTeamMembers);
router.post('/', validate(createTeamMemberSchema), createTeamMember);
router.get('/:id', getTeamMember);
router.put('/:id', validate(updateTeamMemberSchema), updateTeamMember);
router.delete('/:id', deleteTeamMember);

export default router;
