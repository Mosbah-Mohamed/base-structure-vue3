import { z } from 'zod'

export const demoItemSchema = z.object({
  id: z.number().optional(),
  title: z.object({
    ar: z.string().min(2).max(100),
    en: z.string().min(2).max(100),
  }),
  description: z.string().min(5).max(500),
  email: z.string().email(),
  priority: z.enum(['low', 'medium', 'high']),
  is_active: z.boolean(),
})

export type DemoItemFormValues = z.infer<typeof demoItemSchema>
