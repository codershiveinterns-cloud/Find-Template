import { Router } from 'express';
import { createClient, deleteClient, getClient, listClients, updateClient } from '../controllers/client.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireModuleAccess, requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createClientSchema, updateClientSchema } from '../validators/client.validator.js';

const router = Router();

router.use(requireAuth);
router.get('/', requireModuleAccess('clients'), listClients);
router.post('/', requireRole('admin'), requireModuleAccess('clients'), validate(createClientSchema), createClient);
router.get('/:id', requireModuleAccess('clients'), getClient);
router.put('/:id', requireRole('admin'), requireModuleAccess('clients'), validate(updateClientSchema), updateClient);
router.delete('/:id', requireRole('admin'), requireModuleAccess('clients'), deleteClient);

export default router;
