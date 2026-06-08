import { z } from "zod";

export const postSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  content: z.string(),
  authorId: z.string().uuid(),
  published: z.boolean().default(false),
  createdAt: z.date()
});