import { z } from 'zod'

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.log('Invalid Environment Variables', parsedEnv.error.flatten().fieldErrors)
  throw new Error('Invalid Environment Variables')
}

export const env = parsedEnv.data
