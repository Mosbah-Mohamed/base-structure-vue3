import { z } from 'zod'

export const participantCategorySchema = z.object({
  id: z.number().optional(),
  name: z.object({
    ar: z.string().min(1).max(100),
    en: z.string().min(1).max(100),
  }),
  type: z.enum(['highlight', 'ban', 'block', 'general']),
  color: z.string().min(1),
  is_active: z.boolean().default(false),
})

export type ParticipantCategoryFormValues = z.infer<typeof participantCategorySchema>
