import { z } from "zod"

export const loginSchema = z.object({
  email: z.email({ error: "Incorrect email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean(),
})

export type LoginInputs = z.infer<typeof loginSchema>
