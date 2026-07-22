import { z } from "zod";

export const commentSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  authorId: z.string().uuid(),
  content: z.string().min(1).max(1000),
  createdAt: z.date().describe("Comment creation timestamp")
});