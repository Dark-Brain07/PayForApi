import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string().uuid(),
  hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  from: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  value: z.string(),
  timestamp: z.date()
});