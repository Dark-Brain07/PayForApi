import { z } from "zod";

export const notificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  message: z.string(),
  read: z.boolean().default(false),
  createdAt: z.date()
});