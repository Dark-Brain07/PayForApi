import { z } from "zod";

export const subscriptionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  planId: z.string(),
  status: z.enum(["active", "past_due", "canceled", "unpaid"]),
  currentPeriodEnd: z.date()
});