import { z } from "zod";
import { CELO_MAINNET_ID } from "../contracts";

/** ERC-8004 registered onchain agent */
export const agentSchema = z.object({
  id: z.string().uuid().optional(),
  walletAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  name: z.string().min(1).max(64),
  description: z.string().max(256).optional(),
  endpoints: z.array(z.string().url()).default([]),
  erc8004TokenId: z.string().min(1).optional(),
  registryAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address").optional(),
  chainId: z.number().int().default(CELO_MAINNET_ID),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
}).strict();

export type AgentData = z.infer<typeof agentSchema>;
export const validateAgent = (data: unknown) => agentSchema.safeParse(data);
export const parseAgentOrThrow = (data: unknown): AgentData => agentSchema.parse(data);
