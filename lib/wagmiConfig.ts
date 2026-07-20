import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { celo } from "viem/chains";

/** Shared Wagmi configuration instance for RainbowKit integrations */
export const wagmiConfig = getDefaultConfig({
  appName: "Pay For API" as const,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
  chains: [celo],
  ssr: true,
});
