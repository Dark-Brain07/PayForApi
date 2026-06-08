import { z } from "zod";

export const orderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  items: z.array(z.object({ productId: z.string(), quantity: z.number().positive() })),
  totalAmount: z.number().positive(),
  status: z.enum(["pending", "processing", "shipped", "delivered"])
});