import { z } from "zod";

export const contractSchema = z.object({
  id: z.string().uuid(),
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  abi: z.array(z.any()),
  networkId: z.number()
});