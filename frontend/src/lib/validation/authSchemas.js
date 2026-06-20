import { z } from 'zod';

const email = z.string().trim().email('Valid email is required');
const password = z.string().min(8, 'Password must be at least 8 characters');

export const signupSchema = z
  .object({
    accountType: z.enum(['freelancer_individual', 'company_business']),
    name: z.string().trim().min(2, 'Name is required'),
    email,
    role: z.literal('admin'),
    password,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    companyName: z.string().optional(),
    companyEmail: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['confirmPassword'], message: 'Passwords do not match' });
    }
    if (data.accountType === 'company_business') {
      if (!data.companyName?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['companyName'], message: 'Company name is required' });
      }
      if (!data.companyEmail?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['companyEmail'], message: 'Company email is required' });
      } else if (!z.string().email().safeParse(data.companyEmail).success) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['companyEmail'], message: 'Valid company email is required' });
      }
    }
  });

export const loginSchema = z
  .object({
    accountType: z.enum(['freelancer_individual', 'company_business']),
    email,
    password: z.string().min(1, 'Password is required'),
    role: z.literal('admin'),
    companyEmail: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.accountType === 'company_business') {
      if (!data.companyEmail?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['companyEmail'], message: 'Company email is required' });
      } else if (!z.string().email().safeParse(data.companyEmail).success) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['companyEmail'], message: 'Valid company email is required' });
      }
    }
  });
