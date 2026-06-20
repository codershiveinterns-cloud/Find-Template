import { Router } from 'express';
import { createInquiry } from '../controllers/inquiry.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { inquirySchema } from '../validators/inquiry.validator.js';

const router = Router();

router.post('/', validate(inquirySchema), createInquiry);

export default router;
