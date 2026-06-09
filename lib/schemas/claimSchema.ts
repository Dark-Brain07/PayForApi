import { z } from "zod";

/** Creator earnings claim from APIRevenueSplitter.sol */
export const claimSchema = z.object({
  id: z.string().uuid().optional(),
  creatorAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  amount: z.string().regex(/^\d+(\.\d+)?$/, "Must be numeric string"),
  token: z.enum(["cUSD", "cEUR", "cKES", "cBRL", "cGHS", "cCOP", "PUSO"]).default("cUSD"),
  merkleProof: z.array(z.string().regex(/^0x[0-9a-fA-F]{64}$/, "Invalid tx hash")).default([]),
  txHash: z.string().regex(/^0x[0-9a-fA-F]{64}$/, "Invalid tx hash").optional(),
  claimed: z.boolean().default(false),
  claimedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
}).strict();

export type ClaimData = z.infer<typeof claimSchema>;
export const validateClaim = (data: unknown) => claimSchema.safeParse(data);
export const parseClaimOrThrow = (data: unknown): ClaimData => claimSchema.parse(data);
