import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { celo } from "viem/chains";

/** Shared Wagmi configuration instance for RainbowKit */
export const wagmiConfig = getDefaultConfig({
  appName: "Pay For API",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
  chains: [celo],
  ssr: true,
});
