import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).describe("Category name"),
  slug: z.string().min(1).max(100),
  description: z.string().optional()
});