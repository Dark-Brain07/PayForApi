import { z } from "zod";

export const commentSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  authorId: z.string().uuid(),
  content: z.string().trim().min(1, "Comment content cannot be empty").max(1000, "Comment content exceeds 1000 characters"),
  createdAt: z.date()
});