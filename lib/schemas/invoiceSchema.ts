import { z } from "zod";

export const invoiceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  status: z.enum(["pending", "paid", "cancelled"]),
  dueDate: z.date()
});