import { z } from "zod";

export const commentSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  authorId: z.string().uuid(),
  content: z.string().min(1),
  createdAt: z.date()
});