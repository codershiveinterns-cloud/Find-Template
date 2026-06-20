import { z } from 'zod';

const accountType = z.enum(['freelancer_individual', 'company_business']);
const email = z.string().trim().email().toLowerCase();
const password = z.string().min(8, 'Password must be at least 8 characters');

export const signupSchema = z
  .object({
    accountType,
    name: z.string().trim().min(2, 'Name is required'),
    email,
    role: z.literal('admin'),
    password,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    companyName: z.string().trim().optional().nullable(),
    companyEmail: email.optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['confirmPassword'], message: 'Passwords do not match' });
    }

    if (data.accountType === 'company_business') {
      if (!data.companyName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['companyName'], message: 'Company name is required' });
      }
      if (!data.companyEmail) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['companyEmail'], message: 'Company email is required' });
      }
    }
  });

export const loginSchema = z
  .object({
    accountType,
    email,
    password: z.string().min(1, 'Password is required'),
    role: z.enum(['admin', 'developer', 'designer']),
    companyEmail: email.optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.accountType === 'company_business' && !data.companyEmail) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['companyEmail'], message: 'Company email is required' });
    }
  });
