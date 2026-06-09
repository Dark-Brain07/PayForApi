import { z } from "zod";

/** ERC-8004 registered onchain agent */
export const agentSchema = z.object({
  id: z.string().uuid().optional(),
  walletAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  name: z.string().max(64),
  description: z.string().max(256).optional(),
  endpoints: z.array(z.string().url()).default([]),
  erc8004TokenId: z.string().optional(),
  registryAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address").optional(),
  chainId: z.number().int().default(42220),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
}).strict();

export type AgentData = z.infer<typeof agentSchema>;
export const validateAgent = (data: unknown) => agentSchema.safeParse(data);
export const parseAgentOrThrow = (data: unknown): AgentData => agentSchema.parse(data);
