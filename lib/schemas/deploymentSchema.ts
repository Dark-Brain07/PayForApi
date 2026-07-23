import { z } from "zod";
import { CELO_MAINNET_ID } from "../contracts";

export const deploymentSchema = z.object({
  id: z.string().trim().uuid().optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Must be semver"),
  environment: z.enum(["development", "staging", "production"]).default("development"),
  commitSha: z.string().length(40, "Must be a full git SHA"),
  deployedBy: z.string().trim().min(1, "Deployed by is required"),
  contractAddresses: z.record(z.string(), z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address")).default({}),
  chainId: z.number().int().default(CELO_MAINNET_ID),
  deployedAt: z.string().datetime(),
  createdAt: z.string().datetime().optional(),
}).strict();

export type DeploymentData = z.infer<typeof deploymentSchema>;
export const validateDeployment = (data: unknown) => deploymentSchema.safeParse(data);
export const parseDeploymentOrThrow = (data: unknown): DeploymentData => deploymentSchema.parse(data);
