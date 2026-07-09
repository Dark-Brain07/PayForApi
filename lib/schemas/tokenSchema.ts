import { z } from "zod";
import { CELO_MAINNET_ID } from "../contracts";

const CELO_TOKENS: Record<string, { address: string; decimals: number }> = {
  USDm: { address: "0x765DE816845861e75A25fCA122bb6898B8B1282a", decimals: 18 },
  EURm: { address: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73", decimals: 18 },
  KESm: { address: "0x456a3D042C0DbD3db53D5489e98dFb038553B0d0", decimals: 18 },
  BRLm: { address: "0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787", decimals: 18 },
  GHSm: { address: "0xfAeA5F3404bbA20D3cc2f8C4B0A888F55a3c7313", decimals: 18 },
  COPm: { address: "0x8A567e2aE79CA692Bd748aB832081C45de4041eA", decimals: 18 },
  PUSO: { address: "0x105d4A9306D2E55a71d2Eb95B81553AE1dC20d7B", decimals: 18 },
};

const EVM_ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;
export const tokenSchema = z.object({
  symbol: z.enum(["USDm", "EURm", "KESm", "BRLm", "GHSm", "COPm", "PUSO"]),
  contractAddress: z.string().regex(EVM_ADDRESS_REGEX, "Invalid EVM address"),
  decimals: z.number().int().default(18).describe("The number of decimals for the token"),
  chainId: z.number().int().default(CELO_MAINNET_ID),
}).strict();

export type TokenData = z.infer<typeof tokenSchema>;
export { CELO_TOKENS };
/** Validates token data against the tokenSchema */
export const validateToken = (data: unknown) => tokenSchema.safeParse(data);
