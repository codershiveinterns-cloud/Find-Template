import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project id');
const role = z.enum(['developer', 'designer']);
const email = z.string().trim().email().toLowerCase();
const assignedProjects = z.array(objectId).default([]);

export const createTeamMemberSchema = z.object({
  name: z.string().trim().min(2, 'Member name is required'),
  email,
  role,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  assignedProjects,
  assignedProjectModule: z.boolean().default(false),
});

export const updateTeamMemberSchema = z.object({
  name: z.string().trim().min(2, 'Member name is required').optional(),
  email: email.optional(),
  role: role.optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  assignedProjects: z.array(objectId).optional(),
  assignedProjectModule: z.boolean().optional(),
});
