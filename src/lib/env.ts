import { z } from 'zod'

const envSchema = z.object({
  VITE_BASE_API_URL: z.string().min(1, 'VITE_BASE_API_URL is required'),
})

function parseEnv() {
  const result = envSchema.safeParse(import.meta.env)

  if (!result.success) {
    console.error('Invalid environment variables:', result.error.flatten().fieldErrors)
    throw new Error('Invalid environment configuration')
  }

  return result.data
}

export const env = parseEnv()
