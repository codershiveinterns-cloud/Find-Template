import { z } from 'zod';

const projectStatus = z.enum(['in_progress', 'completed', 'pending']);

export const projectSchema = z.object({
  name: z.string().trim().min(2, 'Project name is required'),
  status: projectStatus,
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  clientName: z.string().trim().min(2, 'Client name is required'),
  budget: z.number().min(0, 'Budget must be a positive number'),
  templateKey: z.string().trim().optional().nullable(),
  templateName: z.string().trim().optional().nullable(),
  templateType: z.string().trim().optional().nullable(),
});

export const projectStatusSchema = z.object({
  status: projectStatus,
});
