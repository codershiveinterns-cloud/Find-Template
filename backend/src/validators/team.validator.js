import { z } from 'zod';
import { DASHBOARD_MODULE_KEYS } from '../constants/modules.js';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid project id');
const role = z.enum(['developer', 'designer', 'manager']);
const email = z.string().trim().email().toLowerCase();
const assignedProjects = z.array(objectId).default([]);
const managerModule = z.enum(DASHBOARD_MODULE_KEYS);
const assignedModules = z.array(managerModule).default([]);

const normalizeAssignments = (data) => {
  if (data.role === 'manager') {
    data.assignedProjects = [];
    data.assignedProjectModule = false;
    data.assignedModules = data.assignedModules || [];
    return data;
  }

  data.assignedModules = [];
  return data;
};

export const createTeamMemberSchema = z
  .object({
    name: z.string().trim().min(2, 'Member name is required'),
    email,
    role,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    assignedProjects,
    assignedProjectModule: z.boolean().default(false),
    assignedModules,
  })
  .transform(normalizeAssignments)
  .refine((data) => data.role !== 'manager' || data.assignedModules.length > 0, {
    path: ['assignedModules'],
    message: 'Assign at least one module to manager',
  });

export const updateTeamMemberSchema = z
  .object({
    name: z.string().trim().min(2, 'Member name is required').optional(),
    email: email.optional(),
    role: role.optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
    assignedProjects: z.array(objectId).optional(),
    assignedProjectModule: z.boolean().optional(),
    assignedModules: z.array(managerModule).optional(),
  })
  .refine((data) => data.role !== 'manager' || (data.assignedModules || []).length > 0, {
    path: ['assignedModules'],
    message: 'Assign at least one module to manager',
  });
