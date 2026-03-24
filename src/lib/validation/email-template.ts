import { z } from 'zod';

export const emailTemplateSchema = z.object({
  name: z.string().min(3).max(100),
  type: z.string().min(3).max(50),
  subject: z.object({
    en: z.string().min(1),
    bg: z.string().optional(),
    ru: z.string().optional(),
  }),
  body: z.object({
    en: z.string().min(1),
    bg: z.string().optional(),
    ru: z.string().optional(),
  }),
  variables: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const updateEmailTemplateSchema = emailTemplateSchema.partial();

export const previewEmailTemplateSchema = z.object({
  subject: z.object({
    en: z.string().min(1),
    bg: z.string().optional(),
    ru: z.string().optional(),
  }),
  body: z.object({
    en: z.string().min(1),
    bg: z.string().optional(),
    ru: z.string().optional(),
  }),
  variables: z.record(z.string(), z.string()).optional(),
});