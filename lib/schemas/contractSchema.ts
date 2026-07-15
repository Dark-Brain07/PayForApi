import { z } from "zod";

/** Schema for contract verification */
export const contractSchema = z.object({
  id: z.string().uuid(),
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  abi: z.array(z.unknown()),
  networkId: z.number()
}).strict();