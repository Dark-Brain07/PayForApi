import { z } from "zod";

export const profileSchema = z.object({
  userId: z.string().uuid(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(500).optional()
});