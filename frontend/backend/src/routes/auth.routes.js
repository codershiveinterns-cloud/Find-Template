import { Router } from 'express';
import { login, logout, me, requestPasswordResetOtp, resetPasswordWithOtp, signup } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { forgotPasswordRequestSchema, forgotPasswordResetSchema, loginSchema, signupSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password/request-otp', validate(forgotPasswordRequestSchema), requestPasswordResetOtp);
router.post('/forgot-password/reset', validate(forgotPasswordResetSchema), resetPasswordWithOtp);
router.post('/logout', logout);


router.get('/me', requireAuth, me);

export default router;
