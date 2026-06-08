import { z } from "zod";

export const paymentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  amount: z.number().positive(),
  method: z.enum(["credit_card", "crypto", "paypal"]),
  status: z.enum(["processing", "completed", "failed"]),
  createdAt: z.date()
});