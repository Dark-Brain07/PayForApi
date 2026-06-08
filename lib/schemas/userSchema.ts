import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3),
  createdAt: z.date(),
  isActive: z.boolean().default(true)
});