import { Router } from 'express';
import { createInvoice, deleteInvoice, listInvoices, updateInvoice } from '../controllers/invoice.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireModuleAccess, requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createInvoiceSchema, updateInvoiceSchema } from '../validators/invoice.validator.js';

const router = Router();

router.use(requireAuth);
router.get('/', requireModuleAccess('invoices'), listInvoices);
router.post('/', requireRole('admin'), requireModuleAccess('invoices'), validate(createInvoiceSchema), createInvoice);
router.put('/:id', requireRole('admin'), requireModuleAccess('invoices'), validate(updateInvoiceSchema), updateInvoice);
router.delete('/:id', requireRole('admin'), requireModuleAccess('invoices'), deleteInvoice);

export default router;
