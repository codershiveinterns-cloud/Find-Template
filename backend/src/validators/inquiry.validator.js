import { z } from 'zod';

export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Valid email is required').toLowerCase(),
  message: z.string().trim().min(5, 'Message is required'),
});
